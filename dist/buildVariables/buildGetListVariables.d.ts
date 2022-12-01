import type {
  FetchType,
  IntrospectionResult,
  IntrospectedResource,
} from '../types';
type BuildGetListVariables = (
  introspectionResults: IntrospectionResult
) => (
  resource: IntrospectedResource,
  aorFetchType: FetchType,
  params: any
) => any;
export declare const buildGetListVariables: BuildGetListVariables;
export {};
//# sourceMappingURL=buildGetListVariables.d.ts.map
