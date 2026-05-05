import { parse, DocumentNode } from 'graphql';
import type { AggregateFields, CountOptions } from './types';

const COLUMN_OPERATORS = [
  'sum',
  'avg',
  'min',
  'max',
  'stddev',
  'stddev_pop',
  'stddev_samp',
  'variance',
  'var_pop',
  'var_samp',
] as const;

function buildCountSelection(count: CountOptions): string {
  if (count === true) return 'count';
  const args: string[] = [];
  if (count.columns?.length) {
    args.push(`columns: [${count.columns.join(', ')}]`);
  }
  if (count.distinct !== undefined) {
    args.push(`distinct: ${count.distinct}`);
  }
  return args.length ? `count(${args.join(', ')})` : 'count';
}

function buildAggregateSelection(aggregate: AggregateFields): string {
  const parts: string[] = [];

  if (aggregate.count !== undefined) {
    parts.push(buildCountSelection(aggregate.count));
  }

  for (const op of COLUMN_OPERATORS) {
    const columns = aggregate[op];
    if (columns?.length) {
      parts.push(`${op} { ${columns.join(' ')} }`);
    }
  }

  return parts.join('\n      ');
}

export function buildAggregateQuery(
  resource: string,
  aggregateFieldName: string,
  aggregate: AggregateFields,
  hasDistinctOn: boolean
): DocumentNode {
  const distinctOnArg = hasDistinctOn
    ? `, $distinct_on: [${resource}_select_column!]`
    : '';
  const distinctOnField = hasDistinctOn
    ? '\n    distinct_on: $distinct_on'
    : '';

  const queryString = `
    query GetAggregate($where: ${resource}_bool_exp${distinctOnArg}) {
      ${aggregateFieldName}(where: $where${distinctOnField}) {
        aggregate {
          ${buildAggregateSelection(aggregate)}
        }
      }
    }
  `;

  return parse(queryString);
}
