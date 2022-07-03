'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildCreateVariables = void 0;
const typeAwareKeyValueReducer_1 = require('./typeAwareKeyValueReducer');
const buildCreateVariables =
  (introspectionResults) => (resource, _, params, __) => {
    const reducer = (0, typeAwareKeyValueReducer_1.typeAwareKeyValueReducer)(
      introspectionResults,
      resource,
      params
    );
    return Object.keys(params.data).reduce(reducer, {});
  };
exports.buildCreateVariables = buildCreateVariables;
