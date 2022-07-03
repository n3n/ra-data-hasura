'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const graphql_1 = require('graphql');
const isList = (type) => {
  if (type.kind === graphql_1.TypeKind.NON_NULL) {
    return isList(type.ofType);
  }
  return type.kind === graphql_1.TypeKind.LIST;
};
exports.default = isList;
