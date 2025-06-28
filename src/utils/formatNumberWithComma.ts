export function formatNumberWithComma(value: unknown): string {
  const number = Number(value);
  if (isNaN(number)) return '';
  return number.toLocaleString('en-US');
}
