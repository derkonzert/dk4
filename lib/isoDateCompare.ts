export function isoDateIsSameDay(isoDate1, isoDate2) {
  return isoDate1.slice(0, 10) === isoDate2.slice(0, 10);
}
export function isoDateIsSameMonth(isoDate1, isoDate2) {
  return isoDate1.slice(0, 8) === isoDate2.slice(0, 8);
}
