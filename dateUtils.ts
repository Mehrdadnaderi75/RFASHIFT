
export const getPersianDate = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date).replace(/\//g, '-');
};

export const getJalaliParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).formatToParts(date);
  
  return {
    year: parseInt(parts.find(p => p.type === 'year')?.value || '1403'),
    month: parseInt(parts.find(p => p.type === 'month')?.value || '1'),
    day: parseInt(parts.find(p => p.type === 'day')?.value || '1'),
  };
};

// Fix: Added missing getCurrentPersianYearMonth for calendar views
export const getCurrentPersianYearMonth = () => {
  const parts = getJalaliParts(new Date());
  return { year: parts.year, month: parts.month };
};

// Fix: Added missing getHoliday for calendar rendering
export const getHoliday = (month: number, day: number) => {
  const holidays: Record<string, string> = {
    '1-1': 'نوروز',
    '1-2': 'نوروز',
    '1-3': 'نوروز',
    '1-4': 'نوروز',
    '1-12': 'روز جمهوری اسلامی',
    '1-13': 'روز طبیعت'
  };
  return holidays[`${month}-${day}`] || null;
};

export const PERSIAN_MONTH_NAMES = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

export const getDaysInMonth = (year: number, month: number) => {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return [1403, 1408, 1412].includes(year) ? 30 : 29;
};
