'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildGqlQuery = void 0;
const gqlTypes = __importStar(require('graphql-ast-types-browser'));
const fetchActions_1 = require('../helpers/fetchActions');
const buildFields_1 = require('./buildFields');
const buildArgs_1 = require('./buildArgs');
const buildGqlQuery =
  (
    _,
    buildFields,
    buildMetaArgs,
    buildArgs,
    buildApolloArgs,
    aggregateFieldName
  ) =>
  (resource, aorFetchType, queryType, variables) => {
    const { sortField, sortOrder } = variables,
      metaVariables = __rest(variables, ['sortField', 'sortOrder']);
    const apolloArgs = buildApolloArgs(queryType, variables);
    const args = buildArgs(queryType, variables);
    const metaArgs = buildMetaArgs(queryType, metaVariables, aorFetchType);
    const fields = buildFields(resource.type, aorFetchType);
    if (
      aorFetchType === fetchActions_1.GET_LIST ||
      aorFetchType === fetchActions_1.GET_MANY ||
      aorFetchType === fetchActions_1.GET_MANY_REFERENCE
    ) {
      return gqlTypes.document([
        gqlTypes.operationDefinition(
          'query',
          gqlTypes.selectionSet([
            gqlTypes.field(
              gqlTypes.name(queryType.name),
              gqlTypes.name('items'),
              args,
              null,
              gqlTypes.selectionSet(fields)
            ),
            gqlTypes.field(
              gqlTypes.name(aggregateFieldName(queryType.name)),
              gqlTypes.name('total'),
              metaArgs,
              null,
              gqlTypes.selectionSet([
                gqlTypes.field(
                  gqlTypes.name('aggregate'),
                  null,
                  null,
                  null,
                  gqlTypes.selectionSet([
                    gqlTypes.field(gqlTypes.name('count')),
                  ])
                ),
              ])
            ),
          ]),
          gqlTypes.name(queryType.name),
          apolloArgs
        ),
      ]);
    }
    if (
      aorFetchType === fetchActions_1.CREATE ||
      aorFetchType === fetchActions_1.UPDATE ||
      aorFetchType === fetchActions_1.UPDATE_MANY ||
      aorFetchType === fetchActions_1.DELETE ||
      aorFetchType === fetchActions_1.DELETE_MANY
    ) {
      return gqlTypes.document([
        gqlTypes.operationDefinition(
          'mutation',
          gqlTypes.selectionSet([
            gqlTypes.field(
              gqlTypes.name(queryType.name),
              gqlTypes.name('data'),
              args,
              null,
              gqlTypes.selectionSet([
                gqlTypes.field(
                  gqlTypes.name('returning'),
                  null,
                  null,
                  null,
                  gqlTypes.selectionSet(fields)
                ),
              ])
            ),
          ]),
          gqlTypes.name(queryType.name),
          apolloArgs
        ),
      ]);
    }
    return gqlTypes.document([
      gqlTypes.operationDefinition(
        'query',
        gqlTypes.selectionSet([
          gqlTypes.field(
            gqlTypes.name(queryType.name),
            gqlTypes.name('returning'),
            args,
            null,
            gqlTypes.selectionSet(fields)
          ),
        ]),
        gqlTypes.name(queryType.name),
        apolloArgs
      ),
    ]);
  };
exports.buildGqlQuery = buildGqlQuery;
const buildGqlQueryFactory = (introspectionResults) =>
  (0, exports.buildGqlQuery)(
    introspectionResults,
    buildFields_1.buildFields,
    buildArgs_1.buildMetaArgs,
    buildArgs_1.buildArgs,
    buildArgs_1.buildApolloArgs,
    (resourceName) => `${resourceName}_aggregate`
  );
exports.default = buildGqlQueryFactory;
