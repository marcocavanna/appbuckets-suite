type AfterOrBefore = 'after' | 'before';

export type Comparison<T> = keyof T | string | ((data: T) => any);

export type ComparisonOrder = 'asc' | 'desc';

export interface ArraySorterOptions {
  /** Choose string comparison type */
  compareStringCase?: 'sensitive' | 'insensitive';

  /** Choose if falsy value must be placed after or before */
  placeFalse?: AfterOrBefore;

  /** Choose if nil value must be placed after or before */
  placeNil?: AfterOrBefore;
}
