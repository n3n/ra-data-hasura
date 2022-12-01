import { IntrospectionObjectType, FieldNode } from 'graphql';
import { FetchType } from '../types';
export type BuildFields = (
  type: IntrospectionObjectType,
  aorFetchType?: FetchType
) => FieldNode[];
export declare const buildFields: BuildFields;
//# sourceMappingURL=buildFields.d.ts.map
