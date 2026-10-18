// 다른 모듈을 가져오지 않는다. tests/profile-completed-at.test.mjs가 이 파일만 트랜스파일해 검사한다.
export const formatProfileCompletedAt = (value: string | null) => {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?(Z|[+-]\d{2}:\d{2})?$/);
  if (!match) return null;

  const [, year, month, day, hour, minute, second, , offset] = match;
  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const leapYear = yearNumber % 4 === 0 && (yearNumber % 100 !== 0 || yearNumber % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (yearNumber === 0 || monthNumber < 1 || monthNumber > 12 ||
    Number(day) < 1 || Number(day) > daysInMonth[monthNumber - 1] ||
    Number(hour) > 23 || Number(minute) > 59 || Number(second ?? 0) > 59) return null;

  if (!offset) return `${year}.${month}.${day} ${hour}:${minute} 분석 완료`;
  if (offset !== "Z" && (Number(offset.slice(1, 3)) > 23 || Number(offset.slice(4)) > 59)) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value;
  return `${part("year")?.padStart(4, "0")}.${part("month")}.${part("day")} ${part("hour")}:${part("minute")} 분석 완료`;
};
