export type CountOptions =
  | true
  | { columns?: readonly string[]; distinct?: boolean };

export type ColumnOperator =
  | 'sum'
  | 'avg'
  | 'min'
  | 'max'
  | 'stddev'
  | 'stddev_pop'
  | 'stddev_samp'
  | 'variance'
  | 'var_pop'
  | 'var_samp';

export type AggregateFields = {
  count?: CountOptions;
} & Partial<Record<ColumnOperator, readonly string[]>>;

type ColumnResult<Cols extends readonly string[]> = {
  [K in Cols[number]]: number | null;
};

export type AggregateResultOf<F extends AggregateFields> = {
  [K in keyof F]: K extends 'count'
    ? number
    : K extends ColumnOperator
      ? F[K] extends readonly string[]
        ? ColumnResult<F[K]>
        : never
      : never;
};

export type GetAggregateParams<F extends AggregateFields> = {
  aggregate: F;
  filter?: Record<string, any>;
  distinctOn?: string[];
  meta?: Record<string, any>;
};
