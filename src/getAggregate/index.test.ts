import { makeGetAggregate } from './index';

const makeClient = (responseData: any) => ({
  query: jest.fn().mockResolvedValue({ data: responseData }),
});

describe('getAggregate', () => {
  it('throws when no client is provided', async () => {
    const getAggregate = makeGetAggregate(null, (r) => `${r}_aggregate`);
    await expect(
      getAggregate('orders', { aggregate: { count: true } })
    ).rejects.toThrow('requires an Apollo client');
  });

  it('throws when aggregateFieldName returns NO_COUNT', async () => {
    const client = makeClient({});
    const getAggregate = makeGetAggregate(client, () => 'NO_COUNT');
    await expect(
      getAggregate('orders', { aggregate: { count: true } })
    ).rejects.toThrow("'NO_COUNT'");
  });

  it('calls client.query with the correct document and variables', async () => {
    const client = makeClient({
      orders_aggregate: { aggregate: { count: 5 } },
    });
    const getAggregate = makeGetAggregate(client, (r) => `${r}_aggregate`);

    await getAggregate('orders', {
      aggregate: { count: true },
      filter: { status: 'paid' },
    });

    expect(client.query).toHaveBeenCalledTimes(1);
    const callArgs = client.query.mock.calls[0][0];
    expect(callArgs.variables.where).toEqual({
      _and: [{ status: { _eq: 'paid' } }],
    });
    expect(callArgs.fetchPolicy).toBe('network-only');
  });

  it('returns parsed aggregate data', async () => {
    const client = makeClient({
      orders_aggregate: {
        aggregate: { count: 42, sum: { amount: 1234 } },
      },
    });
    const getAggregate = makeGetAggregate(client, (r) => `${r}_aggregate`);

    const result = await getAggregate('orders', {
      aggregate: { count: true, sum: ['amount'] as const },
    });

    expect(result).toEqual({ data: { count: 42, sum: { amount: 1234 } } });
  });

  it('passes meta as Apollo context', async () => {
    const client = makeClient({
      orders_aggregate: { aggregate: { count: 1 } },
    });
    const getAggregate = makeGetAggregate(client, (r) => `${r}_aggregate`);
    const meta = { headers: { 'x-hasura-role': 'admin' } };

    await getAggregate('orders', { aggregate: { count: true }, meta });

    expect(client.query.mock.calls[0][0].context).toEqual(meta);
  });

  it('includes distinct_on variable when distinctOn is provided', async () => {
    const client = makeClient({
      orders_aggregate: { aggregate: { count: 1 } },
    });
    const getAggregate = makeGetAggregate(client, (r) => `${r}_aggregate`);

    await getAggregate('orders', {
      aggregate: { count: true },
      distinctOn: ['customer_id'],
    });

    expect(client.query.mock.calls[0][0].variables.distinct_on).toEqual([
      'customer_id',
    ]);
  });
});
