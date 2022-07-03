'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.FetchType =
  exports.default =
  exports.buildVariables =
  exports.buildQuery =
  exports.getResponseParser =
  exports.buildGqlQuery =
  exports.buildApolloArgs =
  exports.buildMetaArgs =
  exports.buildArgs =
  exports.buildFields =
    void 0;
var buildFields_1 = require('./buildGqlQuery/buildFields');
Object.defineProperty(exports, 'buildFields', {
  enumerable: true,
  get: function () {
    return buildFields_1.buildFields;
  },
});
var buildArgs_1 = require('./buildGqlQuery/buildArgs');
Object.defineProperty(exports, 'buildArgs', {
  enumerable: true,
  get: function () {
    return buildArgs_1.buildArgs;
  },
});
Object.defineProperty(exports, 'buildMetaArgs', {
  enumerable: true,
  get: function () {
    return buildArgs_1.buildMetaArgs;
  },
});
Object.defineProperty(exports, 'buildApolloArgs', {
  enumerable: true,
  get: function () {
    return buildArgs_1.buildApolloArgs;
  },
});
var buildGqlQuery_1 = require('./buildGqlQuery');
Object.defineProperty(exports, 'buildGqlQuery', {
  enumerable: true,
  get: function () {
    return buildGqlQuery_1.buildGqlQuery;
  },
});
var getResponseParser_1 = require('./getResponseParser');
Object.defineProperty(exports, 'getResponseParser', {
  enumerable: true,
  get: function () {
    return getResponseParser_1.getResponseParser;
  },
});
const buildQuery_1 = __importDefault(require('./buildQuery'));
exports.buildQuery = buildQuery_1.default;
var buildVariables_1 = require('./buildVariables');
Object.defineProperty(exports, 'buildVariables', {
  enumerable: true,
  get: function () {
    return buildVariables_1.buildVariables;
  },
});
var customDataProvider_1 = require('./customDataProvider');
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return customDataProvider_1.buildCustomDataProvider;
  },
});
var types_1 = require('./types');
Object.defineProperty(exports, 'FetchType', {
  enumerable: true,
  get: function () {
    return types_1.FetchType;
  },
});
