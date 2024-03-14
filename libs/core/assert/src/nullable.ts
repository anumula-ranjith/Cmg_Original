export const isNonNullable = <T = unknown>(value: T): value is Exclude<T, null | undefined> =>
  value != null;

export const assertIsNonNullable = <T>(value: T): Exclude<T, null | undefined> => {
  if (!isNonNullable(value)) {
    throw new Error(`Expected value to be non-nullable`);
  }

  return value;
};
