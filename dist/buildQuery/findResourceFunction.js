'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.findResourceFunction = void 0;
const types_1 = require('../types');
function overrideResourceTypeName(resource, resourceTypeName) {
  resource = Object.assign(Object.assign({}, resource), {
    [types_1.FetchType.GET_LIST]: Object.assign(
      Object.assign({}, resource[types_1.FetchType.GET_LIST]),
      { name: resourceTypeName }
    ),
    [types_1.FetchType.GET_MANY]: Object.assign(
      Object.assign({}, resource[types_1.FetchType.GET_MANY]),
      { name: resourceTypeName }
    ),
    [types_1.FetchType.GET_MANY_REFERENCE]: Object.assign(
      Object.assign({}, resource[types_1.FetchType.GET_MANY_REFERENCE]),
      { name: resourceTypeName }
    ),
    type: Object.assign(Object.assign({}, resource.type), {
      name: resourceTypeName,
    }),
  });
  return resource;
}
function findResourceFunction(
  functionResources,
  resourceName,
  resource,
  introspectionResults
) {
  const functionResource = functionResources.find(
    (r) =>
      (r === null || r === void 0 ? void 0 : r.function_name) === resourceName
  );
  if (functionResource) {
    resource = introspectionResults.resources.find(
      (r) => r.type.name === functionResource.resource_name
    );
    if (resource) {
      resource = overrideResourceTypeName(
        resource,
        functionResource.function_name
      );
    }
  }
  return resource;
}
exports.findResourceFunction = findResourceFunction;
