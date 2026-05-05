export function parseAggregateResponse(
  response: { data: any },
  aggregateFieldName: string
): { data: any } {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename, ...data } =
    response.data?.[aggregateFieldName]?.aggregate ?? {};
  return { data };
}
