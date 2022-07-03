import { BuildGqlQueryFactory } from '../buildGqlQuery';
import { GetResponseParser } from '../getResponseParser';
import type { FetchType, IntrospectionResult } from '../types';
export declare type BuildQuery = (
  introspectionResults: IntrospectionResult
) => (
  aorFetchType: FetchType,
  resourceName: string,
  params: any
) => {
  query: any;
  variables: any;
  parseResponse: ({ data }: any) => {
    data: any;
    total?: number;
  };
};
export declare type BuildQueryFactory = (
  buildVariablesImpl: any,
  buildGqlQueryImpl: BuildGqlQueryFactory,
  getResponseParserImpl: GetResponseParser
) => BuildQuery;
export declare const buildQueryFactory: BuildQueryFactory;
declare const _default: BuildQuery;
export default _default;
//# sourceMappingURL=index.d.ts.map
