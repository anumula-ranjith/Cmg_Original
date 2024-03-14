import { format, isValid, parseISO, startOfDay } from 'date-fns';

export function parseDate(iso: string | undefined | null): Date | null {
  if (!iso) {
    return null;
  }

  const isoDate = parseISO(iso);
  return startOfDay(isoDate);
}

export function formatDate(date: Date | null): Date | string | null {
  if (!date) {
    return null;
  }

  if (!isValid(date)) {
    return date;
  }

  return format(date, 'yyyy-MM-dd');
}
