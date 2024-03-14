/**
 * A Key Value Pair Type for Generic use cases.
 */
export type KeyValue<Value = unknown, Key extends string | number | symbol = string> = Record<
  Key,
  Value
>;

/**
 * Removes the index signature from a type
 */
export type NoIndex<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};

export const isKeyValue = (value: unknown): value is KeyValue => typeof value === 'object';
