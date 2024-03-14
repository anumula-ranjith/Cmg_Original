import type { TimeZone } from 'timezone-mock';
import { register, unregister } from 'timezone-mock';

import { formatDate, parseDate } from './FormikDatePickerField.model';

/**
 * We are using timezone-mock to test behavior of the component in different timezones.
 * These different timezones are set in 'beforeEach' block and unset in 'afterEach'.
 *
 * On the other hand tests defined by 'it.each' or 'describe.each' definitions are collected BEFORE
 * these tests are executed.
 *
 * This means that calling 'new Date' in these definitions uses always 'UTC' timezone and hence in
 * order to get date based on mocked timezone we need to pass factory that creates the date in runtime.
 */
describe('DatePicker.model', () => {
  describe.each`
    timezone
    ${'Australia/Adelaide'}
    ${'Europe/London'}
    ${'UTC'}
    ${'US/Pacific'}
  `('When timezone is set to $timezone', ({ timezone }: { timezone: TimeZone }) => {
    beforeEach(() => {
      register(timezone);
    });

    afterEach(() => {
      unregister();
    });

    describe('parseDate', () => {
      it.each`
        isoDate                      | getExpectedResult                          | expectedResult
        ${undefined}                 | ${() => null}                              | ${null}
        ${null}                      | ${() => null}                              | ${null}
        ${'2021-09-27'}              | ${() => new Date(2021, 8, 27, 0, 0, 0, 0)} | ${new Date(2021, 8, 27, 0, 0, 0, 0)}
        ${'2021-09-27T14:33:05.123'} | ${() => new Date(2021, 8, 27, 0, 0, 0, 0)} | ${new Date(2021, 8, 27, 0, 0, 0, 0)}
        ${'2021-09-27T00:33:05.123'} | ${() => new Date(2021, 8, 27, 0, 0, 0, 0)} | ${new Date(2021, 8, 27, 0, 0, 0, 0)}
        ${'2021-09-27T23:33:05.123'} | ${() => new Date(2021, 8, 27, 0, 0, 0, 0)} | ${new Date(2021, 8, 27, 0, 0, 0, 0)}
      `(
        'should return $expectedResult, when executed with $isoDate',
        ({
          isoDate,
          getExpectedResult,
        }: {
          isoDate: string | undefined | null;
          getExpectedResult: () => null | Date;
        }) => {
          const result = parseDate(isoDate);
          expect(result).toEqual(getExpectedResult());
        }
      );
    });

    describe('formatDate', () => {
      it.each`
        date                                 | getDate                                    | expectedResult
        ${null}                              | ${() => null}                              | ${null}
        ${new Date(2021, 8, 27)}             | ${() => new Date(2021, 8, 27)}             | ${'2021-09-27'}
        ${new Date(2021, 8, 27, 22, 50, 23)} | ${() => new Date(2021, 8, 27, 22, 50, 23)} | ${'2021-09-27'}
      `(
        'should return $expectedResult, when executed with $date',
        ({
          getDate,
          expectedResult,
        }: {
          getDate: () => Date | null;
          expectedResult: string | null;
        }) => {
          const result = formatDate(getDate());
          expect(result).toEqual(expectedResult);
        }
      );

      it('should return received invalid date when executed with invalid date', () => {
        const invalidDate = new Date(NaN);
        const result = formatDate(invalidDate);
        expect(result).toEqual(invalidDate);
      });
    });
  });
});
