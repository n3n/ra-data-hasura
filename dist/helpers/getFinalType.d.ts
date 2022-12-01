import {
  IntrospectionType,
  IntrospectionTypeRef,
  IntrospectionNonNullTypeRef,
} from 'graphql';
type GraphQLTypes =
  | IntrospectionType
  | IntrospectionNonNullTypeRef
  | IntrospectionTypeRef;
/**
 * Ensure we get the real type even if the root type is NON_NULL or LIST
 * @param {GraphQLType} type
 */
declare const getFinalType: (type: GraphQLTypes) => IntrospectionType;
export default getFinalType;
//# sourceMappingURL=getFinalType.d.ts.map
