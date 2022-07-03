'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildQueryFactory = void 0;
const buildVariables_1 = require('../buildVariables');
const buildGqlQuery_1 = __importDefault(require('../buildGqlQuery'));
const getResponseParser_1 = require('../getResponseParser');
const findResourceFunction_1 = require('./findResourceFunction');
const getKnownResourceFunctions_1 = require('./getKnownResourceFunctions');
const buildQueryFactory =
  (buildVariablesImpl, buildGqlQueryImpl, getResponseParserImpl) =>
  (introspectionResults) => {
    const typeNames = introspectionResults.resources.map((r) => r.type.name);
    const functionResources = (0,
    getKnownResourceFunctions_1.getKnownResourceFunctions)(
      introspectionResults
    );
    const functionNames = functionResources.map((f) =>
      f === null || f === void 0 ? void 0 : f.function_name
    );
    const knownResources = [...typeNames, ...functionNames];
    return (aorFetchType, resourceName, params) => {
      let resource = introspectionResults.resources.find(
        (r) => r.type.name === resourceName
      );
      // If the resource is a function, we need to find the resource it returns
      if (!resource) {
        resource = (0, findResourceFunction_1.findResourceFunction)(
          functionResources,
          resourceName,
          resource,
          introspectionResults
        );
      }
      if (!resource) {
        if (knownResources.length) {
          throw new Error(
            `Unknown resource ${resourceName}. Make sure it has been declared on your server side schema. Known resources are ${knownResources.join(
              ', '
            )}`
          );
        } else {
          throw new Error(
            `Unknown resource ${resourceName}. No resources were found. Make sure it has been declared on your server side schema and check if your Authorization header is properly set up.`
          );
        }
      }
      const queryType = resource[aorFetchType];
      if (!queryType) {
        throw new Error(
          `No query or mutation matching fetch type ${aorFetchType} could be found for resource ${resource.type.name}`
        );
      }
      const variables = buildVariablesImpl(introspectionResults)(
        resource,
        aorFetchType,
        params,
        queryType
      );
      const query = buildGqlQueryImpl(introspectionResults)(
        resource,
        aorFetchType,
        queryType,
        variables
      );
      const parseResponse = getResponseParserImpl(introspectionResults)(
        aorFetchType,
        resource
      );
      return {
        query,
        variables,
        parseResponse,
      };
    };
  };
exports.buildQueryFactory = buildQueryFactory;
exports.default = (0, exports.buildQueryFactory)(
  buildVariables_1.buildVariables,
  buildGqlQuery_1.default,
  getResponseParser_1.getResponseParser
);
