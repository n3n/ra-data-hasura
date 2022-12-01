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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildApolloArgs = exports.buildMetaArgs = exports.buildArgs = void 0;
const gqlTypes = __importStar(require('../graphql-ast-types-browser'));
const fetchActions_1 = require('../helpers/fetchActions');
const getArgType_1 = __importDefault(require('../helpers/getArgType'));
const buildArgs = (query, variables) => {
  if (query.args.length === 0) {
    return [];
  }
  const validVariables = Object.keys(variables).filter(
    (k) => typeof variables[k] !== 'undefined'
  );
  return query.args
    .filter((a) => validVariables.includes(a.name))
    .reduce(
      (acc, arg) => [
        ...acc,
        gqlTypes.argument(
          gqlTypes.name(arg.name),
          gqlTypes.variable(gqlTypes.name(arg.name))
        ),
      ],
      []
    );
};
exports.buildArgs = buildArgs;
const buildMetaArgs = (query, variables, aorFetchType) => {
  if (query.args.length === 0) {
    return [];
  }
  const validVariables = Object.keys(variables).filter((k) => {
    if (
      aorFetchType === fetchActions_1.GET_LIST ||
      aorFetchType === fetchActions_1.GET_MANY ||
      aorFetchType === fetchActions_1.GET_MANY_REFERENCE
    ) {
      return (
        typeof variables[k] !== 'undefined' && k !== 'limit' && k !== 'offset'
      );
    }
    return typeof variables[k] !== 'undefined';
  });
  return query.args
    .filter((a) => validVariables.includes(a.name))
    .reduce(
      (acc, arg) => [
        ...acc,
        gqlTypes.argument(
          gqlTypes.name(arg.name),
          gqlTypes.variable(gqlTypes.name(arg.name))
        ),
      ],
      []
    );
};
exports.buildMetaArgs = buildMetaArgs;
const buildApolloArgs = (query, variables) => {
  if (query.args.length === 0) {
    return [];
  }
  const validVariables = Object.keys(variables).filter(
    (k) => typeof variables[k] !== 'undefined'
  );
  return query.args
    .filter((a) => validVariables.includes(a.name))
    .reduce((acc, arg) => {
      return [
        ...acc,
        gqlTypes.variableDefinition(
          gqlTypes.variable(gqlTypes.name(arg.name)),
          (0, getArgType_1.default)(arg)
        ),
      ];
    }, []);
};
exports.buildApolloArgs = buildApolloArgs;
