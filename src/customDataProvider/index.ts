import merge from 'lodash/merge';
import buildDataProvider, { Options } from 'ra-data-graphql';
import {
  GET_ONE,
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  DELETE,
  CREATE,
  UPDATE,
  UPDATE_MANY,
  DELETE_MANY,
} from '../helpers/fetchActions';
import {
  buildVariables as defaultBuildVariables,
  BuildVariables,
} from '../buildVariables';
import {
  getResponseParser as defaultGetResponseParser,
  GetResponseParser,
} from '../getResponseParser';
import { buildGqlQuery } from '../buildGqlQuery';
import {
  buildMetaArgs,
  buildArgs,
  buildApolloArgs,
  BuildMetaArgs,
  BuildArgs,
  BuildApolloArgs,
} from '../buildGqlQuery/buildArgs';
import { buildFields, BuildFields } from '../buildGqlQuery/buildFields';
import { buildQueryFactory } from '../buildQuery';
import { createDebugger } from '../debug';
import { buildActionMethods, ActionMethods } from '../actions';
import type { IntrospectionResult } from '../types';

const defaultOptions: Partial<Options> = {
  introspection: {
    operationNames: {
      [GET_LIST]: (resource) => `${resource.name}`,
      [GET_ONE]: (resource) => `${resource.name}`,
      [GET_MANY]: (resource) => `${resource.name}`,
      [GET_MANY_REFERENCE]: (resource) => `${resource.name}`,
      [CREATE]: (resource) => `insert_${resource.name}`,
      [UPDATE]: (resource) => `update_${resource.name}_by_pk`,
      [UPDATE_MANY]: (resource) => `update_${resource.name}`,
      [DELETE]: (resource) => `delete_${resource.name}`,
      [DELETE_MANY]: (resource) => `delete_${resource.name}`,
    },
  },
};

const buildGqlQueryDefaults = {
  buildFields,
  buildMetaArgs,
  buildArgs,
  buildApolloArgs,
  aggregateFieldName: (resourceName: string) => `${resourceName}_aggregate`,
};

export type CustomDataProviderOptions = Partial<Options> & {
  /**
   * Logs every request to the console (query, variables, response, errors,
   * duration). Intended for development; do not enable in production.
   */
  debug?: boolean;
};

export type HasuraDataProvider = ReturnType<typeof buildDataProvider> &
  ActionMethods;

export type BuildCustomDataProvider = (
  options: CustomDataProviderOptions,
  buildGqlQueryOverrides?: {
    buildFields?: BuildFields;
    buildMetaArgs?: BuildMetaArgs;
    buildArgs?: BuildArgs;
    buildApolloArgs?: BuildApolloArgs;
    aggregateFieldName?: (resourceName: string) => string;
  },
  customBuildVariables?: BuildVariables,
  customGetResponseParser?: GetResponseParser
) => HasuraDataProvider;

export const buildCustomDataProvider: BuildCustomDataProvider = (
  options = {},
  buildGqlQueryOverrides = {},
  customBuildVariables = defaultBuildVariables,
  customGetResponseParser = defaultGetResponseParser
) => {
  const { debug = false, ...restOptions } = options;

  const buildGqlQueryOptions = {
    ...buildGqlQueryDefaults,
    ...buildGqlQueryOverrides,
  };

  const customBuildGqlQuery = (introspectionResults: IntrospectionResult) =>
    buildGqlQuery(
      introspectionResults,
      buildGqlQueryOptions.buildFields,
      buildGqlQueryOptions.buildMetaArgs,
      buildGqlQueryOptions.buildArgs,
      buildGqlQueryOptions.buildApolloArgs,
      buildGqlQueryOptions.aggregateFieldName
    );

  const buildQuery = buildQueryFactory(
    customBuildVariables,
    customBuildGqlQuery,
    customGetResponseParser
  );

  const dbg = debug ? createDebugger() : null;
  const finalBuildQuery = dbg ? dbg.wrapBuildQuery(buildQuery) : buildQuery;

  const provider = buildDataProvider(
    merge({}, defaultOptions, restOptions, { buildQuery: finalBuildQuery })
  );

  const wrappedProvider = dbg ? dbg.wrapDataProvider(provider) : provider;
  const { client, getIntrospection } = provider as unknown as {
    client: Parameters<typeof buildActionMethods>[0];
    getIntrospection: () => Promise<IntrospectionResult>;
  };

  return Object.assign(
    wrappedProvider,
    buildActionMethods(client, getIntrospection)
  ) as HasuraDataProvider;
};
