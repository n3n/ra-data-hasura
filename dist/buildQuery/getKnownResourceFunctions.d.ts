import { IntrospectionResult } from '../types';
export declare function getFunctionName(query?: string | null):
  | {
      function_name: string;
      resource_name: string;
    }
  | undefined;
export declare function getKnownResourceFunctions(
  introspectionResults: IntrospectionResult
): (
  | {
      function_name: string;
      resource_name: string;
    }
  | undefined
)[];
//# sourceMappingURL=getKnownResourceFunctions.d.ts.map
