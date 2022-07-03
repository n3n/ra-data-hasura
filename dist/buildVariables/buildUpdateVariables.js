'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildUpdateVariables = void 0;
const isEqual_1 = __importDefault(require('lodash/isEqual'));
const typeAwareKeyValueReducer_1 = require('./typeAwareKeyValueReducer');
const buildUpdateVariables =
  (introspectionResults) => (resource, _, params, __) => {
    const reducer = (0, typeAwareKeyValueReducer_1.typeAwareKeyValueReducer)(
      introspectionResults,
      resource,
      params
    );
    let permitted_fields = null;
    const resource_name = resource.type.name;
    if (resource_name) {
      let inputType = introspectionResults.types.find(
        (obj) => obj.name === `${resource_name}_set_input`
      );
      if (inputType) {
        let inputTypeFields = inputType.inputFields;
        if (inputTypeFields) {
          permitted_fields = inputTypeFields.map((obj) => obj.name);
        }
      }
    }
    return Object.keys(params.data).reduce((acc, key) => {
      // If hasura permissions do not allow a field to be updated like (id),
      // we are not allowed to put it inside the variables
      // RA passes the whole previous Object here
      // https://github.com/marmelab/react-admin/issues/2414#issuecomment-428945402
      // Fetch permitted fields from *_set_input INPUT_OBJECT and filter out any key
      // not present inside it
      if (permitted_fields && !permitted_fields.includes(key)) return acc;
      if (
        params.previousData &&
        (0, isEqual_1.default)(params.data[key], params.previousData[key])
      ) {
        return acc;
      }
      return reducer(acc, key);
    }, {});
  };
exports.buildUpdateVariables = buildUpdateVariables;
