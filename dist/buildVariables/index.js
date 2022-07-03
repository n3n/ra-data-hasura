'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildVariables = void 0;
const fetchActions_1 = require('../helpers/fetchActions');
const buildGetListVariables_1 = require('./buildGetListVariables');
const buildUpdateVariables_1 = require('./buildUpdateVariables');
const buildCreateVariables_1 = require('./buildCreateVariables');
const makeNestedTarget_1 = require('./makeNestedTarget');
const buildVariables =
  (introspectionResults) => (resource, aorFetchType, params, queryType) => {
    switch (aorFetchType) {
      case fetchActions_1.GET_LIST:
        return (0, buildGetListVariables_1.buildGetListVariables)(
          introspectionResults
        )(resource, aorFetchType, params);
      case fetchActions_1.GET_MANY_REFERENCE: {
        var built = (0, buildGetListVariables_1.buildGetListVariables)(
          introspectionResults
        )(resource, aorFetchType, params);
        if (params.filter) {
          return Object.assign(Object.assign({}, built), {
            where: {
              _and: [
                ...built['where']['_and'],
                (0, makeNestedTarget_1.makeNestedTarget)(
                  params.target,
                  params.id
                ),
              ],
            },
          });
        }
        return Object.assign(Object.assign({}, built), {
          where: (0, makeNestedTarget_1.makeNestedTarget)(
            params.target,
            params.id
          ),
        });
      }
      case fetchActions_1.GET_MANY:
      case fetchActions_1.DELETE_MANY:
        return {
          where: { id: { _in: params.ids } },
        };
      case fetchActions_1.GET_ONE:
        return {
          where: { id: { _eq: params.id } },
          limit: 1,
        };
      case fetchActions_1.DELETE:
        return {
          where: { id: { _eq: params.id } },
        };
      case fetchActions_1.CREATE:
        return {
          objects: (0, buildCreateVariables_1.buildCreateVariables)(
            introspectionResults
          )(resource, aorFetchType, params, queryType),
        };
      case fetchActions_1.UPDATE:
        return {
          _set: (0, buildUpdateVariables_1.buildUpdateVariables)(
            introspectionResults
          )(resource, aorFetchType, params, queryType),
          where: { id: { _eq: params.id } },
        };
      case fetchActions_1.UPDATE_MANY:
        return {
          _set: (0, buildUpdateVariables_1.buildUpdateVariables)(
            introspectionResults
          )(resource, aorFetchType, params, queryType),
          where: { id: { _in: params.ids } },
        };
    }
  };
exports.buildVariables = buildVariables;
