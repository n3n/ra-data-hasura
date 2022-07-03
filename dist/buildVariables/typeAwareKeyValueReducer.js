'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.typeAwareKeyValueReducer = void 0;
const typeAwareKeyValueReducer =
  (introspectionResults, resource, params) => (acc, key) => {
    var _a, _b;
    const type = introspectionResults.types.find(
      (t) => t.name === resource.type.name
    );
    let value = params.data[key];
    if (type) {
      const field =
        (_a = type === null || type === void 0 ? void 0 : type.fields) ===
          null || _a === void 0
          ? void 0
          : _a.find((t) => t.name === key);
      if (
        ((_b = field === null || field === void 0 ? void 0 : field.type) ===
          null || _b === void 0
          ? void 0
          : _b.name) === 'date' &&
        params.data[key] === ''
      ) {
        value = null;
      }
    }
    return resource.type.fields.some((f) => f.name === key)
      ? Object.assign(Object.assign({}, acc), { [key]: value })
      : acc;
  };
exports.typeAwareKeyValueReducer = typeAwareKeyValueReducer;
