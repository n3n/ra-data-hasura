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
exports.is = is;
exports.isType = isType;
exports.validate = validate;
exports.shallowEqual = shallowEqual;
require('./definitions/init');
var _require = require('./definitions'),
  ALIAS_KEYS = _require.ALIAS_KEYS,
  NODE_FIELDS = _require.NODE_FIELDS,
  BUILDER_KEYS = _require.BUILDER_KEYS;
var t = exports; // Maps all exports to t
/**
 * Registers `is[Type]` and `assert[Type]` generated functions for a given `type`.
 * Pass `skipAliasCheck` to force it to directly compare `node.type` with `type`.
 */
function registerType(type) {
  var key = 'is' + type;
  var _isType =
    t[key] !== undefined
      ? t[key]
      : (t[key] = function (node, opts) {
          return t.is(type, node, opts);
        });
  t['assert' + type] = function (node) {
    var opts =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!_isType(node, opts)) {
      throw new Error(
        'Expected type "' + type + '" with option ' + JSON.stringify(opts)
      );
    }
  };
}
exports.ALIAS_KEYS = ALIAS_KEYS;
exports.NODE_FIELDS = NODE_FIELDS;
exports.BUILDER_KEYS = BUILDER_KEYS;
/**
 * Registers `is[Type]` and `assert[Type]` for all types.
 */
for (var type in t.NODE_FIELDS) {
  registerType(type);
}
/**
 * Flip `ALIAS_KEYS` for faster access in the reverse direction.
 */
var TYPES = (exports.TYPES = []);
t.FLIPPED_ALIAS_KEYS = Object.keys(t.ALIAS_KEYS).reduce(function (acc, type) {
  var aliasKeys = t.ALIAS_KEYS[type];
  aliasKeys.forEach(function (alias) {
    if (acc[alias] === undefined) {
      TYPES.push(alias); // Populate `TYPES` with FLIPPED_ALIAS_KEY(S)
      // Registers `is[Alias]` and `assert[Alias]` functions for all aliases.
      t[alias.toUpperCase() + '_TYPES'] = acc[alias];
      registerType(alias);
      acc[alias] = [];
    }
    acc[alias].push(type);
  });
  return acc;
}, {});
/**
 * Returns whether `node` is of given `type`.
 *
 * For better performance, use this instead of `is[Type]` when `type` is unknown.
 * Optionally, pass `skipAliasCheck` to directly compare `node.type` with `type`.
 */
function is(type, node, opts) {
  if (
    node === null ||
    (typeof node === 'undefined' ? 'undefined' : _typeof(node)) !== 'object'
  ) {
    return false;
  }
  var matches = isType(node.kind, type);
  if (!matches) {
    return false;
  }
  if (typeof opts === 'undefined') {
    return true;
  } else {
    return t.shallowEqual(node, opts);
  }
}
/**
 * Test if a `nodeType` is a `targetType` or if `targetType` is an alias of `nodeType`.
 */
function isType(nodeType, targetType) {
  if (nodeType === targetType) {
    return true;
  }
  // This is a fast-path. If the test above failed, but an alias key is found, then the
  // targetType was a primary node type, so there's no need to check the aliases.
  if (t.ALIAS_KEYS[targetType]) {
    return false;
  }
  var aliases = t.FLIPPED_ALIAS_KEYS[targetType];
  if (aliases) {
    if (aliases[0] === nodeType) {
      return true;
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;
    try {
      for (
        var _iterator = aliases[Symbol.iterator](), _step;
        !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
        _iteratorNormalCompletion = true
      ) {
        var alias = _step.value;
        if (nodeType === alias) {
          return true;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  return false;
}
/**
 * For each call of #defineType, the following expression evalutates and generates
 * a builder function that validates incoming arguments and returns a valid AST node.
 */
var _loop = function _loop(_type) {
  var keys = t.BUILDER_KEYS[_type];
  var fields = t.NODE_FIELDS[_type];
  function builder() {
    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }
    if (args.length > keys.length) {
      throw new Error(
        't.' +
          _type +
          ': Too many arguments passed. Received ' +
          args.length +
          ' but can receive ' +
          ('no more than ' + keys.length)
      );
    }
    var node = keys.reduce(
      function (node, key, i) {
        node[key] = args[i] === undefined ? fields[key].default : args[i];
        return node;
      },
      { kind: _type }
    );
    for (var key in node) {
      validate(node, key, node[key]);
    }
    return node;
  }
  t[_type[0].toLowerCase() + _type.slice(1)] = builder;
};
for (var _type in t.BUILDER_KEYS) {
  _loop(_type);
}
/**
 * Executes the field validators for a given node
 */
function validate(node, key, val) {
  if (
    node === null ||
    (typeof node === 'undefined' ? 'undefined' : _typeof(node)) !== 'object'
  ) {
    return;
  }
  var fields = t.NODE_FIELDS[node.kind];
  if (fields === undefined) {
    return;
  }
  var field = fields[key];
  if (field === undefined || field.validate === undefined) {
    return;
  }
  if (field.optional && (val === undefined || val === null)) {
    return;
  }
  field.validate(node, key, val);
}
/**
 * Test if an object is shallowly equal.
 */
function shallowEqual(actual, expected) {
  for (var key in expected) {
    if (expected.hasOwnProperty(key) && actual[key] !== expected[key]) {
      return false;
    }
  }
  return true;
}
