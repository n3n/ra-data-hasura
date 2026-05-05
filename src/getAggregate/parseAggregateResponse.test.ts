import { parseAggregateResponse } from './parseAggregateResponse';

describe('parseAggregateResponse', () => {
  it('returns the aggregate data without the outer wrapper', () => {
    const response = {
      data: {
        orders_aggregate: {
          aggregate: { count: 42 },
        },
      },
    };
    expect(parseAggregateResponse(response, 'orders_aggregate')).toEqual({
      data: { count: 42 },
    });
  });

  it('strips __typename from aggregate', () => {
    const response = {
      data: {
        orders_aggregate: {
          aggregate: { __typename: 'orders_aggregate_fields', count: 10 },
        },
      },
    };
    expect(parseAggregateResponse(response, 'orders_aggregate')).toEqual({
      data: { count: 10 },
    });
  });

  it('handles multiple operators', () => {
    const response = {
      data: {
        orders_aggregate: {
          aggregate: {
            count: 100,
            sum: { amount: 9999.99, tax: 999.99 },
            avg: { rating: 4.5 },
            max: { created_at: '2026-05-01' },
          },
        },
      },
    };
    expect(parseAggregateResponse(response, 'orders_aggregate')).toEqual({
      data: {
        count: 100,
        sum: { amount: 9999.99, tax: 999.99 },
        avg: { rating: 4.5 },
        max: { created_at: '2026-05-01' },
      },
    });
  });

  it('returns empty data object when aggregate is missing', () => {
    const response = { data: {} };
    expect(parseAggregateResponse(response, 'orders_aggregate')).toEqual({
      data: {},
    });
  });

  it('handles null values in nested aggregate fields', () => {
    const response = {
      data: {
        orders_aggregate: {
          aggregate: { sum: { amount: null } },
        },
      },
    };
    expect(parseAggregateResponse(response, 'orders_aggregate')).toEqual({
      data: { sum: { amount: null } },
    });
  });
});
