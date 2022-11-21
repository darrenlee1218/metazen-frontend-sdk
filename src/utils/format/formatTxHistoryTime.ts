import { isAfter, startOfToday, parseISO } from 'date-fns';
import { getTimezoneOffset, formatInTimeZone } from 'date-fns-tz';

import { FORMAT_DATE } from '@constants/datetime';

export const formatTxHistoryTime = (data: string): string => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const browserTime = parseISO(data);
  const tzOffset = getTimezoneOffset(tz);
  const startofDateTimeZone = startOfToday().getTime() + tzOffset; // in millisecs

  let date = formatInTimeZone(browserTime, tz, FORMAT_DATE.MM_D);
  if (isAfter(browserTime, startofDateTimeZone)) {
    date = formatInTimeZone(browserTime, tz, FORMAT_DATE.HHmm);
  }
  return date;
};
