import { IntrospectedResource, IntrospectionResult } from '../types';
export declare function findResourceFunction(
  functionResources: (
    | {
        function_name: string;
        resource_name: string;
      }
    | undefined
  )[],
  resourceName: string,
  resource: IntrospectedResource | undefined,
  introspectionResults: IntrospectionResult
): IntrospectedResource | undefined;
//# sourceMappingURL=findResourceFunction.d.ts.map
