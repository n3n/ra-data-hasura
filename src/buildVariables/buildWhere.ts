import set from 'lodash/set';
import omit from 'lodash/omit';
import getFinalType from '../helpers/getFinalType';
import type { IntrospectedResource } from '../types';

const SPLIT_TOKEN = '#';
const SPLIT_OPERATION = '@';

/**
 * Builds a Hasura `where` clause from a react-admin filter object.
 *
 * Handles: `_and`/`_or` combinations, explicit operators via `@`, nested
 * paths via `#`, array values (`_in`), and raw Hasura queries.
 *
 * When `resource` is provided, string fields default to `_ilike` and jsonb
 * fields get `_contains` as in the standard getList filter. Without it,
 * all fields default to `_eq`.
 */
export function buildWhere(
  filterObj: Record<string, any>,
  customFilters: any[],
  resource?: IntrospectedResource
): any {
  const orFilterKeys = Object.keys(filterObj).filter((e) => e.includes(','));

  const orFilterObj = orFilterKeys.reduce(
    (acc, commaSeparatedKey) => {
      const keys = commaSeparatedKey.split(',');
      return {
        ...acc,
        ...keys.reduce(
          (acc2, key) => ({ ...acc2, [key]: filterObj[commaSeparatedKey] }),
          {}
        ),
      };
    },
    {} as Record<string, any>
  );

  const processedFilter = omit(filterObj, orFilterKeys);

  const filterReducer = (obj: any) => (acc: any, key: any) => {
    let filter;
    if (key === 'ids') {
      filter = { id: { _in: obj['ids'] } };
    } else if (Array.isArray(obj[key])) {
      const [keyName, operation = '_in', opPath] = key.split(SPLIT_OPERATION);
      const value = opPath
        ? set({}, opPath.split(SPLIT_TOKEN), obj[key])
        : obj[key];
      filter = set({}, keyName.split(SPLIT_TOKEN), { [operation]: value });
    } else if (obj[key] && obj[key].format === 'hasura-raw-query') {
      filter = set({}, key.split(SPLIT_TOKEN), obj[key].value || {});
    } else {
      let [keyName, operation = ''] = key.split(SPLIT_OPERATION);
      let operator;
      if (operation === '{}') operator = {};
      const field = resource?.type.fields.find((f) => f.name === keyName);
      if (field) {
        switch (getFinalType(field.type).name) {
          case 'String':
            operation = operation || '_ilike';
            if (!operator)
              operator = {
                [operation]: operation.includes('like')
                  ? `%${obj[key]}%`
                  : obj[key],
              };
            break;
          case 'jsonb':
            try {
              const parsedJSONQuery = JSON.parse(obj[key]);
              if (parsedJSONQuery) {
                operator = { [operation || '_contains']: parsedJSONQuery };
              }
            } catch (ex) {}
            break;
          default:
            if (!operator)
              operator = {
                [operation || '_eq']: operation.includes('like')
                  ? `%${obj[key]}%`
                  : obj[key],
              };
        }
      } else {
        if (!operator)
          operator = {
            [operation || '_eq']: operation.includes('like')
              ? `%${obj[key]}%`
              : obj[key],
          };
      }
      filter = set({}, keyName.split(SPLIT_TOKEN), operator);
    }
    return [...acc, filter];
  };

  const andFilters = Object.keys(processedFilter)
    .reduce(filterReducer(processedFilter), customFilters)
    .filter(Boolean);
  const orFilters = Object.keys(orFilterObj)
    .reduce(filterReducer(orFilterObj), [])
    .filter(Boolean);

  return {
    _and: andFilters,
    ...(orFilters.length && { _or: orFilters }),
  };
}
