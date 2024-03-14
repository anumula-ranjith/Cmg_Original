import { toCamelCase, toSentenceCase, toTitleCase } from './stringutils';

describe('toCamelCase', () => {
  it('should convert a string to camel case', () => {
    expect(toCamelCase('hello world')).toBe('helloWorld');
    expect(toCamelCase('foo bar baz')).toBe('fooBarBaz');
    expect(toCamelCase('lorem ipsum dolor sit amet')).toBe('loremIpsumDolorSitAmet');
  });
});

describe('toTitleCase', () => {
  it('should convert a string to title case', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
    expect(toTitleCase('foo bar baz')).toBe('Foo Bar Baz');
    expect(toTitleCase('lorem ipsum dolor sit amet')).toBe('Lorem Ipsum Dolor Sit Amet');
  });
});

describe('toSentenceCase', () => {
  it('should convert a string to sentence case', () => {
    expect(toSentenceCase('hello world.')).toBe('Hello world.');
    expect(toSentenceCase('foo bar baz!')).toBe('Foo bar baz!');
    expect(toSentenceCase('lorem ipsum dolor sit amet?')).toBe('Lorem ipsum dolor sit amet?');
    expect(toSentenceCase('Lorem Ipsum dolor sit amet?')).toBe('Lorem ipsum dolor sit amet?');
  });
});
