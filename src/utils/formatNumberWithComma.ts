export function formatNumberWithComma(value: string | number): string {
  console.log("formatNumberWithComma input:", value, typeof value);
  const num = Number(value);
  console.log("parsed number:", num);
  if (isNaN(num)) {
    console.warn("Invalid number detected:", value);
    return "0";
  }
  return num.toLocaleString("en-US");
}
