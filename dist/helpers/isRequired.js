'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const graphql_1 = require('graphql');
const isRequired = (type) => {
  if (type.kind === graphql_1.TypeKind.LIST) {
    return isRequired(type.ofType);
  }
  return type.kind === graphql_1.TypeKind.NON_NULL;
};
exports.default = isRequired;
