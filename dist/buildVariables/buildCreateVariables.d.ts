import { FetchType, IntrospectedResource, IntrospectionResult } from '../types';
declare type BuildCreateVariables = (
  introspectionResults: IntrospectionResult
) => (
  resource: IntrospectedResource,
  aorFetchType: FetchType,
  params: any,
  queryType: any
) => any;
export declare const buildCreateVariables: BuildCreateVariables;
export {};
//# sourceMappingURL=buildCreateVariables.d.ts.map
