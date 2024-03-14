import { assertIsString, isString } from './string';

describe('isString', () => {
  it('returns true for string', () => {
    const value = 'someString';
    expect(isString(value)).toEqual(true);
  });

  it('returns false for number', () => {
    const value = 1;
    expect(isString(value)).toEqual(false);
  });

  it('returns false for null', () => {
    const value = null;
    expect(isString(value)).toEqual(false);
  });

  it('returns false for undefined', () => {
    const value = undefined;
    expect(isString(value)).toEqual(false);
  });
});

describe('assertIsString', () => {
  it('asserts that value is string', () => {
    const value = 'someString';
    expect(assertIsString(value)).toEqual('someString');
  });

  it('asserts that value is not a string', () => {
    const value = 1;
    expect(() => assertIsString(value)).toThrow('Expected value to be a string');
  });

  it('throws when value is null', () => {
    const value = null;
    expect(() => assertIsString(value)).toThrow('Expected value to be a string');
  });

  it('throws when value is undefined', () => {
    const value = undefined;
    expect(() => assertIsString(value)).toThrow('Expected value to be a string');
  });
});
