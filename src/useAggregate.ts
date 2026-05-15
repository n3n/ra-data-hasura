import { useDataProvider } from 'ra-core';
import { useQuery } from '@tanstack/react-query';
import type {
  AggregateFields,
  GetAggregateParams,
  AggregateResultOf,
} from './getAggregate/types';

/**
 * Hook to run a Hasura aggregate query via the data provider.
 *
 * @example
 * const { data, isLoading } = useAggregate('orders', {
 *   aggregate: { count: true, sum: ['amount'] as const },
 *   filter: { status: 'paid' },
 * });
 * // data: { count: number; sum: { amount: number | null } }
 *
 * Cache key is `[resource, 'aggregate', params]`, so existing react-admin
 * cache invalidations on the resource prefix sweep aggregate results too.
 */
export function useAggregate<F extends AggregateFields>(
  resource: string,
  params: GetAggregateParams<F>,
  options?: { enabled?: boolean }
): ReturnType<typeof useQuery<{ data: AggregateResultOf<F> }>> {
  const dataProvider = useDataProvider() as any;

  return useQuery<{ data: AggregateResultOf<F> }>({
    queryKey: [resource, 'aggregate', params],
    queryFn: () => dataProvider.getAggregate(resource, params),
    enabled: options?.enabled,
  });
}
