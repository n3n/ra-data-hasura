import Maybe from 'graphql/tsutils/Maybe';
import { IntrospectionResult } from '../types';

export function getFunctionName(query: Maybe<string>) {
  if (typeof query != 'string') return undefined;

  const functionReg =
    /execute function "(?<function>.*)" which returns "(?<resource>.*)"$/;
  const match = query.match(functionReg);
  if (!match) {
    return undefined;
  }

  const functionName = match.groups?.function;
  const resourceName = match.groups?.resource;

  if (!functionName || !resourceName) {
    return undefined;
  }

  return {
    function_name: functionName,
    resource_name: resourceName,
  };
}

export function getKnownResourceFunctions(
  introspectionResults: IntrospectionResult
) {
  return introspectionResults.queries
    .filter((q) => getFunctionName(q.description))
    .map((q) => getFunctionName(q.description));
}
