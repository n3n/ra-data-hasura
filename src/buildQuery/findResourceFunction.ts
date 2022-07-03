import { FetchType, IntrospectedResource, IntrospectionResult } from '../types';

function overrideResourceTypeName(
  resource: IntrospectedResource,
  resourceTypeName: string
) {
  resource = {
    ...resource,
    [FetchType.GET_LIST]: {
      ...resource[FetchType.GET_LIST],
      name: resourceTypeName,
    },
    [FetchType.GET_MANY]: {
      ...resource[FetchType.GET_MANY],
      name: resourceTypeName,
    },
    [FetchType.GET_MANY_REFERENCE]: {
      ...resource[FetchType.GET_MANY_REFERENCE],
      name: resourceTypeName,
    },
    type: {
      ...resource.type,
      name: resourceTypeName,
    },
  };
  return resource;
}

export function findResourceFunction(
  functionResources: (
    | { function_name: string; resource_name: string }
    | undefined
  )[],
  resourceName: string,
  resource: IntrospectedResource | undefined,
  introspectionResults: IntrospectionResult
) {
  const functionResource = functionResources.find(
    (r) => r?.function_name === resourceName
  );

  if (functionResource) {
    resource = introspectionResults.resources.find(
      (r) => r.type.name === functionResource.resource_name
    );

    if (resource) {
      resource = overrideResourceTypeName(
        resource,
        functionResource.function_name
      );
    }
  }
  return resource;
}
