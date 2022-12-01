import { BuildGqlQueryFactory } from '../buildGqlQuery';
import { GetResponseParser } from '../getResponseParser';
import type { FetchType, IntrospectionResult } from '../types';
export type QueryResponse = {
  data: any;
  total?: number;
  pageInfo?: {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
};
export type BuildQuery = (introspectionResults: IntrospectionResult) => (
  aorFetchType: FetchType,
  resourceName: string,
  params: any
) => {
  query: any;
  variables: any;
  parseResponse: ({ data }: any) => QueryResponse;
};
export type BuildQueryFactory = (
  buildVariablesImpl: any,
  buildGqlQueryImpl: BuildGqlQueryFactory,
  getResponseParserImpl: GetResponseParser
) => BuildQuery;
export declare const buildQueryFactory: BuildQueryFactory;
declare const _default: BuildQuery;
export default _default;
//# sourceMappingURL=index.d.ts.map
