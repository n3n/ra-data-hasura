'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true,
});
var _typeof =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function (obj) {
        return typeof obj;
      }
    : function (obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj;
      };
exports.default = defineType;
exports.chain = chain;
exports.assertEach = assertEach;
exports.assertOneOf = assertOneOf;
exports.assertNodeType = assertNodeType;
exports.assertNodeOrValueType = assertNodeOrValueType;
exports.assertValueType = assertValueType;
exports.assertArrayOf = assertArrayOf;
var t = require('../index');
var BUILDER_KEYS = (exports.BUILDER_KEYS = {});
var NODE_FIELDS = (exports.NODE_FIELDS = {});
var ALIAS_KEYS = (exports.ALIAS_KEYS = {});
/**
 * Used to define an AST node.
 * @param {String} type The AST node name
 * @param {Object} opts Type definition object
 * @returns {void}
 */
function defineType(type) {
  var _ref =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$fields = _ref.fields,
    fields = _ref$fields === undefined ? {} : _ref$fields,
    _ref$aliases = _ref.aliases,
    aliases = _ref$aliases === undefined ? [] : _ref$aliases,
    _ref$builder = _ref.builder,
    builder = _ref$builder === undefined ? [] : _ref$builder;
  for (var key in fields) {
    var field = fields[key];
    // Sets field as optional if builder exist but validator does not.
    if (builder.indexOf(key) === -1) {
      field.optional = true;
    }
  }
  BUILDER_KEYS[type] = builder;
  NODE_FIELDS[type] = fields;
  ALIAS_KEYS[type] = aliases;
}
function getType(val) {
  if (Array.isArray(val)) {
    return 'array';
  } else if (val === null) {
    return 'null';
  } else if (val === undefined) {
    return 'undefined';
  } else {
    return typeof val === 'undefined' ? 'undefined' : _typeof(val);
  }
}
// Validation helpers
function chain() {
  for (
    var _len = arguments.length, fns = Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    fns[_key] = arguments[_key];
  }
  return function validate() {
    for (
      var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2] = arguments[_key2];
    }
    fns.forEach(function (fn) {
      return fn.apply(undefined, args);
    });
  };
}
function assertEach(callback) {
  function validator(node, key, val) {
    if (!Array.isArray(val)) {
      return;
    }
    val.forEach(function (it, i) {
      return callback(node, key + '[' + i + ']', it);
    });
  }
  return validator;
}
function assertOneOf() {
  for (
    var _len3 = arguments.length, vals = Array(_len3), _key3 = 0;
    _key3 < _len3;
    _key3++
  ) {
    vals[_key3] = arguments[_key3];
  }
  function validate(node, key, val) {
    if (vals.indexOf(val.kind) < 0) {
      throw new TypeError(
        'Property ' +
          key +
          ' expected value to be one of ' +
          JSON.stringify(vals) +
          ' but got ' +
          JSON.stringify(val)
      );
    }
  }
  return validate;
}
function assertNodeType() {
  for (
    var _len4 = arguments.length, types = Array(_len4), _key4 = 0;
    _key4 < _len4;
    _key4++
  ) {
    types[_key4] = arguments[_key4];
  }
  function validate(node, key, val) {
    var valid = types.every(function (type) {
      return t.is(type, val);
    });
    if (!valid) {
      throw new TypeError(
        'Property ' +
          key +
          ' of ' +
          node.type +
          ' expected node to be of a type ' +
          JSON.stringify(types) +
          ' ' +
          ('but instead got ' + JSON.stringify(val && val.type))
      );
    }
  }
  return validate;
}
function assertNodeOrValueType() {
  for (
    var _len5 = arguments.length, types = Array(_len5), _key5 = 0;
    _key5 < _len5;
    _key5++
  ) {
    types[_key5] = arguments[_key5];
  }
  function validate(node, key, val) {
    var valid = types.every(function (type) {
      return getType(val) === type || t.is(type, val);
    });
    if (!valid) {
      throw new TypeError(
        'Property ' +
          key +
          ' of ' +
          node.type +
          ' expected node to be of a type ' +
          JSON.stringify(types) +
          ' ' +
          ('but instead got ' + JSON.stringify(val && val.type))
      );
    }
  }
  return validate;
}
function assertValueType(type) {
  function validate(node, key, val) {
    var valid = getType(val) === type;
    if (!valid) {
      throw new TypeError(
        'Property ' +
          key +
          ' expected type of ' +
          type +
          ' but got ' +
          getType(val)
      );
    }
  }
  return validate;
}
function assertArrayOf(cb) {
  return chain(assertValueType('array'), assertEach(cb));
}
