import { assertIsNonNullable, isNonNullable } from './nullable';

describe('isNonNullable', () => {
  it('returns true for nullable', () => {
    const value = 1;
    expect(isNonNullable(value)).toEqual(true);
  });

  it('returns false for null', () => {
    const value = null;
    expect(isNonNullable(value)).toEqual(false);
  });

  it('returns false for undefined', () => {
    const value = undefined;
    expect(isNonNullable(value)).toEqual(false);
  });
});

describe('assertIsNonNullable', () => {
  it('asserts that value is non-nullable', () => {
    const value = 1;
    expect(assertIsNonNullable(value)).toEqual(1);
  });

  it('throws when value is null', () => {
    const value = null;
    expect(() => assertIsNonNullable(value)).toThrow('Expected value to be non-nullable');
  });

  it('throws when value is undefined', () => {
    const value = undefined;
    expect(() => assertIsNonNullable(value)).toThrow('Expected value to be non-nullable');
  });
});
