export function roundNumber(value?: string) {
  if (!value) return value;

  const index = value.indexOf('.');

  if (index === -1) return value;

  return value.substring(0, index + 3);
}
