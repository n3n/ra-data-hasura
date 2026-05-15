import omit from 'lodash/omit';
import set from 'lodash/set';
import { buildWhere } from './buildWhere';
import type {
  FetchType,
  IntrospectionResult,
  IntrospectedResource,
} from '../types';

type BuildGetListVariables = (
  introspectionResults: IntrospectionResult
) => (
  resource: IntrospectedResource,
  aorFetchType: FetchType,
  params: any
) => any;

const MULTI_SORT_TOKEN = ',';
const SPLIT_OPERATION = '@';

export const buildGetListVariables: BuildGetListVariables =
  () => (resource, _, params) => {
    const result: any = {};
    let { filter: filterObj = {} } = params;
    const { customFilters = [] } = params;

    const distinctOnField = 'distinct_on';
    /** Setting "distinct_on" to be the `filters` object attribute to be used inside RA
     * and setting to a `distinct_on` variable
     * and removing from the filter object
     */
    const { distinct_on = '' } = filterObj;
    filterObj = omit(filterObj, [distinctOnField]);

    /**
     * Nested entities are parsed by CRA, which returns a nested object
     * { 'level1': {'level2': 'test'}}
     * instead of { 'level1.level2': 'test'}
     * That's why we use a HASH for properties, when we declared nested stuff at CRA:
     * level1#level2@_ilike
     */

    result['where'] = buildWhere(filterObj, customFilters, resource);

    if (params.pagination && params.pagination.perPage > -1) {
      result['limit'] = parseInt(params.pagination.perPage, 10);
      result['offset'] =
        (params.pagination.page - 1) * params.pagination.perPage;
    }

    if (params.sort) {
      const { field, order } = params.sort;
      const hasMultiSort =
        field.includes(MULTI_SORT_TOKEN) || order.includes(MULTI_SORT_TOKEN);
      if (hasMultiSort) {
        const fields = field.split(MULTI_SORT_TOKEN);
        const orders = order
          .split(MULTI_SORT_TOKEN)
          .map((order: string) => order.toLowerCase());

        if (fields.length !== orders.length) {
          throw new Error(
            `The ${
              resource.type.name
            } list must have an order value for each sort field. Sort fields are "${fields.join(
              ','
            )}" but sort orders are "${orders.join(',')}"`
          );
        }

        const multiSort = fields.map((field: any, index: number) =>
          makeSort(field, orders[index])
        );
        result['order_by'] = multiSort;
      } else {
        result['order_by'] = makeSort(field, order);
      }
    }

    if (distinct_on) {
      result['distinct_on'] = distinct_on;
    }

    return result;
  };

/**
 * if the field contains a SPLIT_OPERATION, it means it's column ordering option.
 *
 * @example
 * ```
 * makeSort('title', 'ASC') => { title: 'asc' }
 * ```
 * @example
 * ```
 * makeSort('title@nulls_last', 'ASC') => { title: 'asc_nulls_last' }
 * ```
 * @example
 * ```
 * makeSort('title@nulls_first', 'ASC') => { title: 'asc_nulls_first' }
 * ```
 *
 */
const makeSort = (field: string, sort: 'ASC' | 'DESC') => {
  const [fieldName, operation] = field.split(SPLIT_OPERATION);
  const fieldSort = operation ? `${sort}_${operation}` : sort;
  return set({}, fieldName, fieldSort.toLowerCase());
};
