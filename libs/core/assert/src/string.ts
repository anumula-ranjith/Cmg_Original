export const isString = (value: unknown): value is string => typeof value === 'string';

export const assertIsString = (value: unknown): string => {
  if (!isString(value)) {
    throw new Error(`Expected value to be a string`);
  }

  return value;
};
