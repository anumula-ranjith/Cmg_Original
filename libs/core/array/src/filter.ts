import { isNonNullable } from '@cmg/core-assert';

/**
 * Filters an array by removing _null_ or _undefined_ values.
 */
export const filterNotNull = <T>(value: T, _index: number, _array: T[]): value is NonNullable<T> =>
  isNonNullable(value);
