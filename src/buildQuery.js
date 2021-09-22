import buildVariables from './buildVariables';
import buildGqlQuery from './buildGqlQuery';
import getResponseParser from './getResponseParser';
import { GET_LIST, GET_MANY, GET_MANY_REFERENCE } from './fetchActions';

const getFunctionName = (query) => {
  if (typeof query != 'string') return undefined;

  const functionReg =
    /execute function "(?<function>.*)" which returns "(?<resource>.*)"$/;
  const match = query.match(functionReg);
  if (!match) {
    return undefined;
  }
  return {
    function_name: match.groups.function,
    resource_name: match.groups.resource,
  };
};

const overrideResourceTypeName = (resource, resourceTypeName) => {
  resource = {
    ...resource,
    [GET_LIST]: {
      ...resource[GET_LIST],
      name: resourceTypeName,
    },
    [GET_MANY]: {
      ...resource[GET_MANY],
      name: resourceTypeName,
    },
    [GET_MANY_REFERENCE]: {
      ...resource[GET_MANY_REFERENCE],
      name: resourceTypeName,
    },
    type: {
      ...resource.type,
      name: resourceTypeName,
    },
  };
  return resource;
};

export const buildQueryFactory =
  (buildVariablesImpl, buildGqlQueryImpl, getResponseParserImpl) =>
  (introspectionResults) => {
    const typeNames = introspectionResults.resources.map((r) => r.type.name);

    const functionResources = introspectionResults.queries
      .filter((q) => getFunctionName(q.description))
      .map((q) => getFunctionName(q.description));

    const knownResources = [
      ...typeNames,
      ...functionResources.map((f) => f.function),
    ];

    return (aorFetchType, resourceName, params) => {
      let resource = introspectionResults.resources.find(
        (r) => r.type.name === resourceName
      );

      // If the resource is a function, we need to find the resource it returns
      if (!resource) {
        const functionResource = functionResources.find(
          (r) => r.function_name === resourceName
        );

        if (functionResource) {
          resource = introspectionResults.resources.find(
            (r) => r.type.name === functionResource.resource_name
          );
          resource = overrideResourceTypeName(
            resource,
            functionResource.resource_name
          );
        }
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
        resource,
        queryType
      );

      return {
        query,
        variables,
        parseResponse,
      };
    };
  };

export default buildQueryFactory(
  buildVariables,
  buildGqlQuery,
  getResponseParser
);
