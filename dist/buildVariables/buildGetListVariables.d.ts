import type {
  FetchType,
  IntrospectionResult,
  IntrospectedResource,
} from '../types';
declare type BuildGetListVariables = (
  introspectionResults: IntrospectionResult
) => (
  resource: IntrospectedResource,
  aorFetchType: FetchType,
  params: any
) => any;
export declare const buildGetListVariables: BuildGetListVariables;
export {};
//# sourceMappingURL=buildGetListVariables.d.ts.map
