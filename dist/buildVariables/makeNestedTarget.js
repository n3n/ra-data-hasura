'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.makeNestedTarget = void 0;
const set_1 = __importDefault(require('lodash/set'));
const makeNestedTarget = (target, id) => {
  // This simple example should make clear what this function does
  // makeNestedTarget("a.b", 42)
  // makeNestedTarget("a#b", 42)
  // => { a: { b: { _eq: 42 } } }
  // makeNestedTarget("a#b@_contains@c#d", id)
  // => { a: { b: { _contains: { c: { d: 42 } } } } }
  // . -> # to make nested filtering support the same separator/standard
  let [path, operation = '_eq', oppath] = target.split('@');
  let value = oppath
    ? (0, set_1.default)(
        {},
        oppath
          .split('.')
          .join('#') // nested filtering support the same standard
          .split('#'),
        id
      )
    : id;
  return (0, set_1.default)({}, path.split('.').join('#').split('#'), {
    [operation]: value,
  });
};
exports.makeNestedTarget = makeNestedTarget;
