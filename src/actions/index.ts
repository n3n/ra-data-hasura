import {
  IntrospectionObjectType,
  IntrospectionTypeRef,
  TypeKind,
  getIntrospectionQuery,
  parse,
  DocumentNode,
} from 'graphql';
import getFinalType from '../helpers/getFinalType';
import type { IntrospectionResult } from '../types';

export type ActionFetchPolicy =
  | 'cache-first'
  | 'cache-and-network'
  | 'network-only'
  | 'cache-only'
  | 'no-cache'
  | 'standby';

export type ActionOptions = {
  fields?: string;
  fetchPolicy?: ActionFetchPolicy;
};

export type ActionMethod = <TData = any, TVariables = Record<string, any>>(
  name: string,
  variables?: TVariables,
  options?: ActionOptions
) => Promise<TData>;

export type ActionMutation = ActionMethod;
export type ActionQuery = ActionMethod;

export type ActionMethods = {
  actionMutation: ActionMethod;
  actionQuery: ActionMethod;
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

const buildScalarSelectionSet = (outputType: IntrospectionObjectType) => {
  const scalars = outputType.fields.filter((f) => {
    const kind = getFinalType(f.type).kind;
    return (
      kind !== TypeKind.OBJECT &&
      kind !== TypeKind.INTERFACE &&
      kind !== TypeKind.UNION
    );
  });
  if (scalars.length === 0) return '{ __typename }';
  return `{ ${scalars.map((f) => f.name).join(' ')} }`;
};

// Loose enough to accept both the real ApolloClient and lightweight test mocks.
type ApolloLikeClient = {
  mutate: (opts: {
    mutation: DocumentNode;
    variables?: any;
    fetchPolicy?: any;
  }) => Promise<{ data?: any }>;
  query: (opts: {
    query: DocumentNode;
    variables?: any;
    fetchPolicy?: any;
  }) => Promise<{ data?: any }>;
};

const INTROSPECTION_QUERY = parse(getIntrospectionQuery());

export const fetchIntrospectionViaClient = async (
  client: ApolloLikeClient
): Promise<IntrospectionResult> => {
  const result = await client.query({
    query: INTROSPECTION_QUERY,
    fetchPolicy: 'no-cache',
  });
  const schema = (result.data as { __schema?: IntrospectionResult['schema'] })
    ?.__schema;
  if (!schema) {
    throw new Error(
      'Introspection query did not return a __schema. The endpoint may have introspection disabled.'
    );
  }
  return {
    schema,
    types: schema.types as IntrospectionResult['types'],
    queries: [],
    resources: [],
  };
};

export const buildActionMethods = (
  client: ApolloLikeClient,
  getIntrospection: () => Promise<IntrospectionResult>
): ActionMethods => {
  const invoke = async (
    operationKeyword: 'mutation' | 'query',
    actionName: string,
    variables: Record<string, unknown> = {},
    options: ActionOptions = {}
  ) => {
    const introspection = await getIntrospection();
    const rootTypeName =
      operationKeyword === 'mutation'
        ? introspection.schema.mutationType?.name
        : introspection.schema.queryType?.name;

    const rootType = introspection.types.find(
      (t) => t.name === rootTypeName
    ) as IntrospectionObjectType | undefined;
    const action = rootType?.fields.find((f) => f.name === actionName);
    if (!action) {
      throw new Error(
        `Hasura ${operationKeyword} "${actionName}" not found on ${rootTypeName ?? 'root type'}.`
      );
    }

    const argNames = new Set(action.args.map((a) => a.name));
    const unknownVars = Object.keys(variables).filter(
      (k) => variables[k] !== undefined && !argNames.has(k)
    );
    if (unknownVars.length > 0) {
      throw new Error(
        `Hasura ${operationKeyword} "${actionName}" does not declare argument(s) ` +
          `[${unknownVars.join(', ')}]. Declared args: [${[...argNames].join(', ') || '(none)'}].`
      );
    }

    const usedArgs = action.args.filter((a) => variables[a.name] !== undefined);
    const cleanVariables: Record<string, unknown> = {};
    for (const a of usedArgs) cleanVariables[a.name] = variables[a.name];

    const varDefs = usedArgs
      .map((a) => `$${a.name}: ${printIntrospectionType(a.type)}`)
      .join(', ');
    const argList = usedArgs.map((a) => `${a.name}: $${a.name}`).join(', ');

    const outputBase = getFinalType(action.type);
    const isObjectOutput =
      outputBase.kind === TypeKind.OBJECT ||
      outputBase.kind === TypeKind.INTERFACE ||
      outputBase.kind === TypeKind.UNION;

    let selectionSet = '';
    if (isObjectOutput) {
      if (options.fields) {
        const trimmed = options.fields.trim();
        selectionSet = trimmed.startsWith('{') ? trimmed : `{ ${trimmed} }`;
      } else {
        const objectType = introspection.types.find(
          (t) => t.name === outputBase.name
        ) as IntrospectionObjectType | undefined;
        selectionSet = objectType
          ? buildScalarSelectionSet(objectType)
          : '{ __typename }';
      }
    }

    const document = parse(
      `${operationKeyword} ${actionName}${varDefs ? `(${varDefs})` : ''} { ` +
        `${actionName}${argList ? `(${argList})` : ''}${selectionSet ? ` ${selectionSet}` : ''}` +
        ` }`
    );

    if (operationKeyword === 'mutation') {
      const result = await client.mutate({
        mutation: document,
        variables: cleanVariables,
        ...(options.fetchPolicy ? { fetchPolicy: options.fetchPolicy } : {}),
      });
      return result.data?.[actionName];
    }

    const result = await client.query({
      query: document,
      variables: cleanVariables,
      // network-only by default: action results are usually side-effectful
      // or freshness-sensitive and shouldn't be served stale from the cache.
      fetchPolicy: options.fetchPolicy ?? 'network-only',
    });
    return result.data?.[actionName];
  };

  return {
    actionMutation: (name, variables, options) =>
      invoke('mutation', name, variables as any, options) as any,
    actionQuery: (name, variables, options) =>
      invoke('query', name, variables as any, options) as any,
  };
};
