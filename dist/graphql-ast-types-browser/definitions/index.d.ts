export const __esModule: boolean;
export default defineType;
export const BUILDER_KEYS: {};
export const NODE_FIELDS: {};
export const ALIAS_KEYS: {};
/**
 * Used to define an AST node.
 * @param {String} type The AST node name
 * @param {Object} opts Type definition object
 * @returns {void}
 */
declare function defineType(type: string, ...args: any[]): void;
export function chain(...args: any[]): (...args: any[]) => void;
export function assertEach(
  callback: any
): (node: any, key: any, val: any) => void;
export function assertOneOf(
  ...args: any[]
): (node: any, key: any, val: any) => void;
export function assertNodeType(
  ...args: any[]
): (node: any, key: any, val: any) => void;
export function assertNodeOrValueType(
  ...args: any[]
): (node: any, key: any, val: any) => void;
export function assertValueType(
  type: any
): (node: any, key: any, val: any) => void;
export function assertArrayOf(cb: any): (...args: any[]) => void;
//# sourceMappingURL=index.d.ts.map
