export function formatNumberWithComma(value: string | number): string {
  const num = Number(value);
  if (isNaN(num)) {
    console.warn("Invalid number detected:", value);
    return "0";
  }
  return num.toLocaleString("en-US");
}
