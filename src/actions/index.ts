import {
  IntrospectionField,
  IntrospectionObjectType,
  IntrospectionTypeRef,
  TypeKind,
  parse,
  DocumentNode,
} from 'graphql';
import type { IntrospectionResult } from '../types';

export type ActionFetchPolicy =
  | 'cache-first'
  | 'cache-and-network'
  | 'network-only'
  | 'cache-only'
  | 'no-cache'
  | 'standby';

export type ActionOptions = {
  /**
   * Custom selection set for the action's output. Only applies when the
   * action returns an object/interface/union type.
   *
   * Pass a GraphQL selection set fragment, with or without surrounding braces:
   *   `'{ id name email }'` or `'id name email'`
   *
   * If omitted, all scalar fields on the output type are selected.
   */
  fields?: string;

  /**
   * Apollo Client fetchPolicy override. Defaults to `'network-only'` for
   * `actionQuery` so action results are not served from the cache, and the
   * Apollo client default for `actionMutation`.
   */
  fetchPolicy?: ActionFetchPolicy;
};

export type ActionMutation = <TData = any, TVariables = Record<string, any>>(
  name: string,
  variables?: TVariables,
  options?: ActionOptions
) => Promise<TData>;

export type ActionQuery = <TData = any, TVariables = Record<string, any>>(
  name: string,
  variables?: TVariables,
  options?: ActionOptions
) => Promise<TData>;

export type ActionMethods = {
  actionMutation: ActionMutation;
  actionQuery: ActionQuery;
};

const printIntrospectionType = (type: IntrospectionTypeRef): string => {
  if (type.kind === TypeKind.NON_NULL) {
    return `${printIntrospectionType(type.ofType)}!`;
  }
  if (type.kind === TypeKind.LIST) {
    return `[${printIntrospectionType(type.ofType)}]`;
  }
  return type.name;
};

type UnwrappedKind = Exclude<TypeKind, TypeKind.NON_NULL | TypeKind.LIST>;

const unwrapTypeRef = (
  type: IntrospectionTypeRef
): { kind: UnwrappedKind; name: string } => {
  if (type.kind === TypeKind.NON_NULL || type.kind === TypeKind.LIST) {
    return unwrapTypeRef(type.ofType);
  }
  return {
    kind: type.kind as UnwrappedKind,
    name: (type as { name: string }).name,
  };
};

const findRootField = (
  introspectionResults: IntrospectionResult,
  rootTypeName: string | null | undefined,
  fieldName: string
): IntrospectionField | undefined => {
  if (!rootTypeName) return undefined;
  const rootType = introspectionResults.types.find(
    (t) => t.name === rootTypeName
  );
  if (!rootType || rootType.kind !== TypeKind.OBJECT) return undefined;
  return (rootType as IntrospectionObjectType).fields.find(
    (f) => f.name === fieldName
  );
};

const wrapSelectionSet = (fieldsStr: string): string => {
  const trimmed = fieldsStr.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('{') ? trimmed : `{ ${trimmed} }`;
};

const buildScalarSelectionSet = (
  outputType: IntrospectionObjectType
): string => {
  const scalars = outputType.fields.filter((f) => {
    const finalType = unwrapTypeRef(f.type);
    return (
      finalType.kind !== TypeKind.OBJECT &&
      finalType.kind !== TypeKind.INTERFACE &&
      finalType.kind !== TypeKind.UNION
    );
  });
  if (scalars.length === 0) return '{ __typename }';
  return `{ ${scalars.map((f) => f.name).join(' ')} }`;
};

type ApolloLikeClient = {
  mutate: (opts: {
    mutation: DocumentNode;
    variables?: Record<string, unknown>;
    fetchPolicy?: ActionFetchPolicy;
  }) => Promise<{ data?: Record<string, unknown> | null }>;
  query: (opts: {
    query: DocumentNode;
    variables?: Record<string, unknown>;
    fetchPolicy?: ActionFetchPolicy;
  }) => Promise<{ data?: Record<string, unknown> | null }>;
};

export type BuildActionMethodsArgs = {
  client: ApolloLikeClient;
  getIntrospection: () => Promise<IntrospectionResult> | undefined;
};

export const buildActionMethods = ({
  client,
  getIntrospection,
}: BuildActionMethodsArgs): ActionMethods => {
  const invoke = async (
    operationKeyword: 'mutation' | 'query',
    actionName: string,
    rawVariables: Record<string, unknown> | undefined,
    options: ActionOptions | undefined
  ): Promise<unknown> => {
    const introspectionPromise = getIntrospection();
    if (!introspectionPromise) {
      throw new Error(
        'Cannot invoke Hasura action: introspection is disabled. ' +
          'Enable introspection in buildHasuraProvider options to use actionMutation/actionQuery.'
      );
    }
    const introspectionResults = await introspectionPromise;

    const rootTypeName =
      operationKeyword === 'mutation'
        ? introspectionResults.schema.mutationType?.name
        : introspectionResults.schema.queryType?.name;

    const action = findRootField(
      introspectionResults,
      rootTypeName,
      actionName
    );
    if (!action) {
      throw new Error(
        `Hasura ${operationKeyword} "${actionName}" was not found on root type "${rootTypeName ?? 'unknown'}". ` +
          'Make sure the action is defined and exposed by your Hasura schema.'
      );
    }

    const cleanVariables: Record<string, unknown> = {};
    if (rawVariables) {
      for (const key of Object.keys(rawVariables)) {
        if (rawVariables[key] !== undefined) {
          cleanVariables[key] = rawVariables[key];
        }
      }
    }

    const usedArgs = action.args.filter((a) =>
      Object.prototype.hasOwnProperty.call(cleanVariables, a.name)
    );

    const requiredMissing = action.args
      .filter(
        (a) =>
          a.type.kind === TypeKind.NON_NULL &&
          !Object.prototype.hasOwnProperty.call(cleanVariables, a.name)
      )
      .map((a) => a.name);
    if (requiredMissing.length > 0) {
      throw new Error(
        `Hasura ${operationKeyword} "${actionName}" is missing required argument(s): ${requiredMissing.join(', ')}`
      );
    }

    const varDefs = usedArgs
      .map((a) => `$${a.name}: ${printIntrospectionType(a.type)}`)
      .join(', ');
    const argList = usedArgs.map((a) => `${a.name}: $${a.name}`).join(', ');

    const outputBase = unwrapTypeRef(action.type);
    const isObjectOutput =
      outputBase.kind === TypeKind.OBJECT ||
      outputBase.kind === TypeKind.INTERFACE ||
      outputBase.kind === TypeKind.UNION;

    let selectionSet = '';
    if (isObjectOutput) {
      if (options?.fields) {
        selectionSet = wrapSelectionSet(options.fields);
      } else {
        const objectType = introspectionResults.types.find(
          (t) => t.name === outputBase.name
        ) as IntrospectionObjectType | undefined;
        selectionSet = objectType
          ? buildScalarSelectionSet(objectType)
          : '{ __typename }';
      }
    }

    const opName = `${operationKeyword === 'mutation' ? 'Action' : 'ActionQuery'}_${actionName}`;
    const documentSource = `${operationKeyword} ${opName}${
      varDefs ? `(${varDefs})` : ''
    } { ${actionName}${argList ? `(${argList})` : ''}${
      selectionSet ? ` ${selectionSet}` : ''
    } }`;

    const document = parse(documentSource);

    if (operationKeyword === 'mutation') {
      const result = await client.mutate({
        mutation: document,
        variables: cleanVariables,
        ...(options?.fetchPolicy ? { fetchPolicy: options.fetchPolicy } : {}),
      });
      return result.data?.[actionName];
    }

    const result = await client.query({
      query: document,
      variables: cleanVariables,
      fetchPolicy: options?.fetchPolicy ?? 'network-only',
    });
    return result.data?.[actionName];
  };

  return {
    actionMutation: ((name, variables, options) =>
      invoke(
        'mutation',
        name,
        variables as Record<string, unknown> | undefined,
        options
      )) as ActionMutation,
    actionQuery: ((name, variables, options) =>
      invoke(
        'query',
        name,
        variables as Record<string, unknown> | undefined,
        options
      )) as ActionQuery,
  };
};
