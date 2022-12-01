export const __esModule: boolean;
export const TYPES: any[];
export const FLIPPED_ALIAS_KEYS: {};
/**
 * Returns whether `node` is of given `type`.
 *
 * For better performance, use this instead of `is[Type]` when `type` is unknown.
 * Optionally, pass `skipAliasCheck` to directly compare `node.type` with `type`.
 */
export function is(type: any, node: any, opts: any): boolean;
/**
 * Test if a `nodeType` is a `targetType` or if `targetType` is an alias of `nodeType`.
 */
export function isType(nodeType: any, targetType: any): boolean;
/**
 * Executes the field validators for a given node
 */
export function validate(node: any, key: any, val: any): void;
/**
 * Test if an object is shallowly equal.
 */
export function shallowEqual(actual: any, expected: any): boolean;
export var ALIAS_KEYS: {};
export var NODE_FIELDS: {};
export var BUILDER_KEYS: {};
//# sourceMappingURL=index.d.ts.map
