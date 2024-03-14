/**
 * Maps a type to be strict, meaning its properties are required and cannot be null or undefined or optional.
 */
export type Strict<T, K extends keyof T> = {
  [P in K]-?: NonNullable<T[P]>;
};

/**
 * Wraps a type with `null` and/or `undefined`.
 * Useful for defensive code when dealing with third-party input.
 */
export type Maybe<T> = null | undefined | T;
