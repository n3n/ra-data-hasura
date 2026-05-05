import { print } from 'graphql';
import { buildAggregateQuery } from './buildAggregateQuery';

const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();

describe('buildAggregateQuery', () => {
  it('simple count', () => {
    const doc = buildAggregateQuery(
      'orders',
      'orders_aggregate',
      { count: true },
      false
    );
    expect(normalize(print(doc))).toMatchInlineSnapshot(
      `"query GetAggregate($where: orders_bool_exp) { orders_aggregate(where: $where) { aggregate { count } } }"`
    );
  });

  it('count with columns and distinct', () => {
    const doc = buildAggregateQuery(
      'orders',
      'orders_aggregate',
      { count: { columns: ['customer_id'], distinct: true } },
      false
    );
    expect(normalize(print(doc))).toMatchInlineSnapshot(
      `"query GetAggregate($where: orders_bool_exp) { orders_aggregate(where: $where) { aggregate { count(columns: [customer_id], distinct: true) } } }"`
    );
  });

  it('sum and avg on multiple columns', () => {
    const doc = buildAggregateQuery(
      'orders',
      'orders_aggregate',
      { sum: ['amount', 'tax'] as const, avg: ['rating'] as const },
      false
    );
    const printed = normalize(print(doc));
    expect(printed).toContain('sum { amount tax }');
    expect(printed).toContain('avg { rating }');
  });

  it('mixed operators', () => {
    const doc = buildAggregateQuery(
      'orders',
      'orders_aggregate',
      {
        count: true,
        sum: ['amount'] as const,
        max: ['created_at'] as const,
      },
      false
    );
    const printed = normalize(print(doc));
    expect(printed).toContain('count');
    expect(printed).toContain('sum { amount }');
    expect(printed).toContain('max { created_at }');
  });

  it('with distinctOn variable', () => {
    const doc = buildAggregateQuery(
      'orders',
      'orders_aggregate',
      { count: true },
      true
    );
    const printed = normalize(print(doc));
    expect(printed).toContain('$distinct_on: [orders_select_column!]');
    expect(printed).toContain('distinct_on: $distinct_on');
  });

  it('uses custom aggregate field name', () => {
    const doc = buildAggregateQuery(
      'products',
      'custom_products_agg',
      { count: true },
      false
    );
    const printed = normalize(print(doc));
    expect(printed).toContain('$where: products_bool_exp');
    expect(printed).toContain('custom_products_agg(where: $where)');
  });

  it('count with empty options object', () => {
    const doc = buildAggregateQuery(
      'orders',
      'orders_aggregate',
      { count: {} },
      false
    );
    expect(normalize(print(doc))).toContain('count');
  });
});
