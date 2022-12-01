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
const gqlTypes = __importStar(require('../graphql-ast-types-browser'));
const getFinalType_1 = __importDefault(require('./getFinalType'));
const isRequired_1 = __importDefault(require('./isRequired'));
const isList_1 = __importDefault(require('./isList'));
const getArgType = (arg) => {
  const type = (0, getFinalType_1.default)(arg.type);
  const required = (0, isRequired_1.default)(arg.type);
  const list = (0, isList_1.default)(arg.type);
  if (required) {
    if (list) {
      return gqlTypes.nonNullType(
        gqlTypes.listType(
          gqlTypes.nonNullType(gqlTypes.namedType(gqlTypes.name(type.name)))
        )
      );
    }
    return gqlTypes.nonNullType(gqlTypes.namedType(gqlTypes.name(type.name)));
  }
  if (list) {
    return gqlTypes.listType(gqlTypes.namedType(gqlTypes.name(type.name)));
  }
  return gqlTypes.namedType(gqlTypes.name(type.name));
};
exports.default = getArgType;
