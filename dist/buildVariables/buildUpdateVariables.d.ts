import { FetchType, IntrospectedResource, IntrospectionResult } from '../types';
type BuildUpdateVariables = (
  introspectionResults: IntrospectionResult
) => (
  resource: IntrospectedResource,
  aorFetchType: FetchType,
  params: any,
  queryType: any
) => any;
export declare const buildUpdateVariables: BuildUpdateVariables;
export {};
//# sourceMappingURL=buildUpdateVariables.d.ts.map
