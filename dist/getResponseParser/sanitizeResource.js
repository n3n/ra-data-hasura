'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.sanitizeResource = void 0;
const sanitizeResource = (data = {}) => {
  const result = Object.keys(data).reduce((acc, key) => {
    // intend to remove the following reserved names https://spec.graphql.org/draft/#sec-Names.Reserved-Names
    if (key.startsWith('__')) {
      return acc;
    }
    const dataKey = data[key];
    if (Array.isArray(dataKey)) {
      if (dataKey[0] && typeof dataKey[0] === 'object') {
        // if var is an array of reference objects with id properties
        if (dataKey[0].id != null) {
          return Object.assign(Object.assign({}, acc), {
            [key]: dataKey.map(exports.sanitizeResource),
            [`${key}Ids`]: dataKey.map((d) => d.id),
          });
        } else {
          return Object.assign(Object.assign({}, acc), {
            [key]: dataKey.map(exports.sanitizeResource),
          });
        }
      } else {
        return Object.assign(Object.assign({}, acc), { [key]: dataKey });
      }
    }
    if (
      typeof dataKey === 'object' &&
      dataKey !== null &&
      dataKey !== undefined
    ) {
      return Object.assign(
        Object.assign(
          Object.assign({}, acc),
          dataKey &&
            dataKey.id && {
              [`${key}.id`]: dataKey.id,
            }
        ),
        { [key]: (0, exports.sanitizeResource)(dataKey) }
      );
    }
    return Object.assign(Object.assign({}, acc), { [key]: dataKey });
  }, {});
  return result;
};
exports.sanitizeResource = sanitizeResource;
