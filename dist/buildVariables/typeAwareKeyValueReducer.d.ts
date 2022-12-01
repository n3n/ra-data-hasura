import { IntrospectionResult, IntrospectedResource } from '../types';
/**
 * Returns a reducer that converts the react-admin key-values to hasura-acceptable values
 *
 * Currently that means that dates should never be an empty string, but in the future that can be extended
 * See https://github.com/marmelab/react-admin/pull/6199
 *
 */
type TypeAwareKeyValueReducer = (
  introspectionResults: IntrospectionResult,
  resource: IntrospectedResource,
  params: any
) => (acc: any, key: any) => any;
export declare const typeAwareKeyValueReducer: TypeAwareKeyValueReducer;
export {};
//# sourceMappingURL=typeAwareKeyValueReducer.d.ts.map
