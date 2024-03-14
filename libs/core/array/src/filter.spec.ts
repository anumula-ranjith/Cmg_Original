import { filterNotNull } from './filter';

describe('filter', () => {
  describe('filterNotNull', () => {
    it('returns true when is not null or undefined', () => {
      expect(filterNotNull({}, 0, [])).toEqual(true);
    });

    it('returns false when is null', () => {
      expect(filterNotNull(null, 0, [])).toEqual(false);
    });

    it('returns false when is undefined', () => {
      expect(filterNotNull(undefined, 0, [])).toEqual(false);
    });
  });
});
