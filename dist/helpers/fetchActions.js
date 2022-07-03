'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.sanitizeFetchType =
  exports.fetchActionsWithTotalResponse =
  exports.fetchActionsWithArrayOfRecordsResponse =
  exports.fetchActionsWithArrayOfIdentifiedRecordsResponse =
  exports.fetchActionsWithRecordResponse =
  exports.DELETE_MANY =
  exports.DELETE =
  exports.UPDATE_MANY =
  exports.UPDATE =
  exports.CREATE =
  exports.GET_MANY_REFERENCE =
  exports.GET_MANY =
  exports.GET_ONE =
  exports.GET_LIST =
    void 0;
exports.GET_LIST = 'GET_LIST';
exports.GET_ONE = 'GET_ONE';
exports.GET_MANY = 'GET_MANY';
exports.GET_MANY_REFERENCE = 'GET_MANY_REFERENCE';
exports.CREATE = 'CREATE';
exports.UPDATE = 'UPDATE';
exports.UPDATE_MANY = 'UPDATE_MANY';
exports.DELETE = 'DELETE';
exports.DELETE_MANY = 'DELETE_MANY';
exports.fetchActionsWithRecordResponse = [
  exports.GET_ONE,
  exports.CREATE,
  exports.UPDATE,
];
exports.fetchActionsWithArrayOfIdentifiedRecordsResponse = [
  exports.GET_LIST,
  exports.GET_MANY,
  exports.GET_MANY_REFERENCE,
];
exports.fetchActionsWithArrayOfRecordsResponse = [
  ...exports.fetchActionsWithArrayOfIdentifiedRecordsResponse,
  exports.UPDATE_MANY,
  exports.DELETE_MANY,
];
exports.fetchActionsWithTotalResponse = [
  exports.GET_LIST,
  exports.GET_MANY_REFERENCE,
];
const sanitizeFetchType = (fetchType) => {
  switch (fetchType) {
    case exports.GET_LIST:
      return 'getList';
    case exports.GET_ONE:
      return 'getOne';
    case exports.GET_MANY:
      return 'getMany';
    case exports.GET_MANY_REFERENCE:
      return 'getManyReference';
    case exports.CREATE:
      return 'create';
    case exports.UPDATE:
      return 'update';
    case exports.UPDATE_MANY:
      return 'updateMany';
    case exports.DELETE:
      return 'delete';
    case exports.DELETE_MANY:
      return 'deleteMany';
    default:
      return fetchType;
  }
};
exports.sanitizeFetchType = sanitizeFetchType;
