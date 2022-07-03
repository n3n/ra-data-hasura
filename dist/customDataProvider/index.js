'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildCustomDataProvider = void 0;
const merge_1 = __importDefault(require('lodash/merge'));
const ra_data_graphql_1 = __importDefault(require('ra-data-graphql'));
const fetchActions_1 = require('../helpers/fetchActions');
const buildVariables_1 = require('../buildVariables');
const getResponseParser_1 = require('../getResponseParser');
const buildGqlQuery_1 = require('../buildGqlQuery');
const buildArgs_1 = require('../buildGqlQuery/buildArgs');
const buildFields_1 = require('../buildGqlQuery/buildFields');
const buildQuery_1 = require('../buildQuery');
const defaultOptions = {
  introspection: {
    operationNames: {
      [fetchActions_1.GET_LIST]: (resource) => `${resource.name}`,
      [fetchActions_1.GET_ONE]: (resource) => `${resource.name}`,
      [fetchActions_1.GET_MANY]: (resource) => `${resource.name}`,
      [fetchActions_1.GET_MANY_REFERENCE]: (resource) => `${resource.name}`,
      [fetchActions_1.CREATE]: (resource) => `insert_${resource.name}`,
      [fetchActions_1.UPDATE]: (resource) => `update_${resource.name}`,
      [fetchActions_1.UPDATE_MANY]: (resource) => `update_${resource.name}`,
      [fetchActions_1.DELETE]: (resource) => `delete_${resource.name}`,
      [fetchActions_1.DELETE_MANY]: (resource) => `delete_${resource.name}`,
    },
  },
};
const buildGqlQueryDefaults = {
  buildFields: buildFields_1.buildFields,
  buildMetaArgs: buildArgs_1.buildMetaArgs,
  buildArgs: buildArgs_1.buildArgs,
  buildApolloArgs: buildArgs_1.buildApolloArgs,
  aggregateFieldName: (resourceName) => `${resourceName}_aggregate`,
};
const buildCustomDataProvider = (
  options = {},
  buildGqlQueryOverrides = {},
  customBuildVariables = buildVariables_1.buildVariables,
  customGetResponseParser = getResponseParser_1.getResponseParser
) => {
  const buildGqlQueryOptions = Object.assign(
    Object.assign({}, buildGqlQueryDefaults),
    buildGqlQueryOverrides
  );
  const customBuildGqlQuery = (introspectionResults) =>
    (0, buildGqlQuery_1.buildGqlQuery)(
      introspectionResults,
      buildGqlQueryOptions.buildFields,
      buildGqlQueryOptions.buildMetaArgs,
      buildGqlQueryOptions.buildArgs,
      buildGqlQueryOptions.buildApolloArgs,
      buildGqlQueryOptions.aggregateFieldName
    );
  const buildQuery = (0, buildQuery_1.buildQueryFactory)(
    customBuildVariables,
    customBuildGqlQuery,
    customGetResponseParser
  );
  return (0, ra_data_graphql_1.default)(
    (0, merge_1.default)({}, defaultOptions, { buildQuery }, options)
  );
};
exports.buildCustomDataProvider = buildCustomDataProvider;
