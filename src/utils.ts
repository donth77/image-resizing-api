export function isNumber(value: string): boolean {
  return value != null && value !== '' && !isNaN(Number(value.toString()));
}
