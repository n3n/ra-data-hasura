import { IntrospectionField } from 'graphql';
import { BuildFields } from './buildFields';
import { BuildArgs, BuildMetaArgs, BuildApolloArgs } from './buildArgs';
import { FetchType, IntrospectionResult } from '../types';
export type BuildGqlQuery = (
  introspectionResults: IntrospectionResult,
  buildFields: BuildFields,
  buildMetaArgs: BuildMetaArgs,
  buildArgs: BuildArgs,
  buildApolloArgs: BuildApolloArgs,
  aggregateFieldName: (resourceName: string) => string
) => (
  resource: any,
  aorFetchType: FetchType,
  queryType: IntrospectionField,
  variables: any
) => any;
export type BuildGqlQueryFactory = (
  introspectionResults: IntrospectionResult
) => ReturnType<BuildGqlQuery>;
export declare const buildGqlQuery: BuildGqlQuery;
declare const buildGqlQueryFactory: BuildGqlQueryFactory;
export default buildGqlQueryFactory;
//# sourceMappingURL=index.d.ts.map
