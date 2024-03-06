import { endOfMonth, endOfYear, startOfMonth, startOfYear } from 'date-fns';

import { DateKeyword, DateKeywordType } from '../types/globalTypes';

export type DateRange = {
  startDate: Date;
  endDate: Date | undefined;
};

export const DATE_KEYWORD_TO_DATE_RANGE: Record<
  DateKeywordType,
  ({ referenceDate }: { referenceDate: Date }) => DateRange
> = {
  [DateKeyword.DAY]: ({ referenceDate }) => ({
    startDate: referenceDate,
    endDate: referenceDate,
  }),
  [DateKeyword.MONTH]: ({ referenceDate }) => {
    // Get the start of the current month
    const startOfCurrentMonth = startOfMonth(referenceDate);

    // Get the end of the current month
    const endOfCurrentMonth = endOfMonth(referenceDate);

    return {
      startDate: startOfCurrentMonth,
      endDate: endOfCurrentMonth,
    };
  },
  [DateKeyword.YEAR]: ({ referenceDate }) => {
    // Get the start of the current year
    const startOfCurrentYear = startOfYear(referenceDate);

    // Get the end of the current year
    const endOfCurrentYear = endOfYear(referenceDate);

    return {
      startDate: startOfCurrentYear,
      endDate: endOfCurrentYear,
    };
  },
};
