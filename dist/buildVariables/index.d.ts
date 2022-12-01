import { FetchType, IntrospectedResource, IntrospectionResult } from '../types';
export type BuildVariables = (
  introspectionResults: IntrospectionResult
) => (
  resource: IntrospectedResource,
  aorFetchType: FetchType,
  params: any,
  queryType: any
) => any;
export declare const buildVariables: BuildVariables;
//# sourceMappingURL=index.d.ts.map
