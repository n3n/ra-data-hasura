declare type TargetEquals = {
  _eq: any;
};
declare type NestedTarget<K> =
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
