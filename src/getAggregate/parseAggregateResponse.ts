export function parseAggregateResponse(
  response: { data: any },
  aggregateFieldName: string
): { data: any } {
  const { __typename: _, ...data } =
    response.data?.[aggregateFieldName]?.aggregate ?? {};
  return { data };
}
