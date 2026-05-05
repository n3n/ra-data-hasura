import { buildWhere } from '../buildVariables/buildWhere';
import { buildAggregateQuery } from './buildAggregateQuery';
import { parseAggregateResponse } from './parseAggregateResponse';
import type {
  AggregateFields,
  AggregateResultOf,
  GetAggregateParams,
} from './types';

type ApolloClientLike = {
  query(options: {
    query: any;
    variables?: any;
    context?: any;
    fetchPolicy?: string;
  }): Promise<{ data: any }>;
};

export function makeGetAggregate(
  client: ApolloClientLike | null | undefined,
  aggregateFieldNameFn: (resource: string) => string
) {
  return async function getAggregate<F extends AggregateFields>(
    resource: string,
    params: GetAggregateParams<F>
  ): Promise<{ data: AggregateResultOf<F> }> {
    if (!client) {
      throw new Error(
        `getAggregate requires an Apollo client. Pass \`client\` in the options to buildHasuraProvider.`
      );
    }

    const aggregateKey = aggregateFieldNameFn(resource);
    if (aggregateKey === 'NO_COUNT') {
      throw new Error(
        `aggregateFieldName returned 'NO_COUNT' for resource '${resource}'. Cannot run getAggregate on this resource.`
      );
    }

    const where = buildWhere(params.filter ?? {}, []);
    const hasDistinctOn = (params.distinctOn?.length ?? 0) > 0;

    const query = buildAggregateQuery(
      resource,
      aggregateKey,
      params.aggregate,
      hasDistinctOn
    );

    const variables: Record<string, any> = { where };
    if (hasDistinctOn) {
      variables.distinct_on = params.distinctOn;
    }

    const result = await client.query({
      query,
      variables,
      context: params.meta,
      fetchPolicy: 'network-only',
    });

    return parseAggregateResponse(result, aggregateKey) as {
      data: AggregateResultOf<F>;
    };
  };
}
