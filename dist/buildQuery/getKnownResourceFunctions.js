'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getKnownResourceFunctions = exports.getFunctionName = void 0;
function getFunctionName(query) {
  var _a, _b;
  if (typeof query != 'string') return undefined;
  const functionReg =
    /execute function "(?<function>.*)" which returns "(?<resource>.*)"$/;
  const match = query.match(functionReg);
  if (!match) {
    return undefined;
  }
  const functionName =
    (_a = match.groups) === null || _a === void 0 ? void 0 : _a.function;
  const resourceName =
    (_b = match.groups) === null || _b === void 0 ? void 0 : _b.resource;
  if (!functionName || !resourceName) {
    return undefined;
  }
  return {
    function_name: functionName,
    resource_name: resourceName,
  };
}
exports.getFunctionName = getFunctionName;
function getKnownResourceFunctions(introspectionResults) {
  return introspectionResults.queries
    .filter((q) => getFunctionName(q.description))
    .map((q) => getFunctionName(q.description));
}
exports.getKnownResourceFunctions = getKnownResourceFunctions;
