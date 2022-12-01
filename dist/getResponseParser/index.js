'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getResponseParser = void 0;
const fetchActions_1 = require('../helpers/fetchActions');
const sanitizeResource_1 = require('./sanitizeResource');
const getResponseParser = () => (aorFetchType) => (res) => {
  const response = res.data;
  switch (aorFetchType) {
    case fetchActions_1.GET_MANY_REFERENCE:
    case fetchActions_1.GET_LIST:
      let output = {
        data: response.items.map(sanitizeResource_1.sanitizeResource),
      };
      if (typeof response.total !== 'undefined') {
        output.total = response.total.aggregate.count;
      } else {
        // TODO: behave smarter and set hasNextPage=false when no more records exist.
        output.pageInfo = {
          hasPreviousPage: true,
          hasNextPage: true,
        };
      }
      return output;
    case fetchActions_1.GET_MANY:
      return { data: response.items.map(sanitizeResource_1.sanitizeResource) };
    case fetchActions_1.GET_ONE:
      return {
        data: (0, sanitizeResource_1.sanitizeResource)(response.returning[0]),
      };
    case fetchActions_1.CREATE:
    case fetchActions_1.UPDATE:
    case fetchActions_1.DELETE:
      return {
        data: (0, sanitizeResource_1.sanitizeResource)(
          response.data.returning[0]
        ),
      };
    case fetchActions_1.UPDATE_MANY:
    case fetchActions_1.DELETE_MANY:
      return { data: response.data.returning.map((x) => x.id) };
    default:
      throw Error(`Expected a proper fetchType, got: ${aorFetchType}`);
  }
};
exports.getResponseParser = getResponseParser;
