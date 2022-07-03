import { IntrospectionResult, IntrospectedResource, FetchType } from '../types';
export declare type GetResponseParser = (
  introspectionResults: IntrospectionResult
) => (
  aorFetchType: FetchType,
  resource?: IntrospectedResource
) => (res: { data: any }) => {
  data: any;
  total?: number;
};
export declare const getResponseParser: GetResponseParser;
//# sourceMappingURL=index.d.ts.map
