type TargetEquals = {
  _eq: any;
};
type NestedTarget<K> =
  | K
  | {
      [key: string]: K | NestedTarget<K>;
    };
export declare const makeNestedTarget: (
  target: string,
  id: string | number
) => NestedTarget<TargetEquals>;
export {};
//# sourceMappingURL=makeNestedTarget.d.ts.map
