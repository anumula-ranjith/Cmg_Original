import { Formatter } from './formatter';
import { tests } from './tests.json';

type input = (typeof tests)[0];

describe('Formatter', () => {
  // We have to overide the the timezone to UTC
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const realToLocale = Date.prototype.toLocaleDateString;
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line no-extend-native
  Date.prototype.toLocaleDateString = function (
    locale: Intl.LocalesArgument,
    options: Intl.DateTimeFormatOptions | undefined
  ) {
    // eslint-disable-next-line
    return realToLocale.call(this, locale, { ...options, timeZone: 'UTC' });
  };

  // const formatter = new Formatter(); // We dont use any instance v
  // Simple formatter tests
  test.each(tests)('$test: $format', function ({ format, input, expect: expected }: input) {
    expect(new Formatter().format(format, input)).toBe(expected);
  });
});
