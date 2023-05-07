export function findEqualIndex<T>(arr: readonly T[], index: number, equal: (a: T, b: T) => boolean): number {
  const item = arr[index];
  let result = 0;
  for (let i = 0; i < index; i++) {
    if (equal(item, arr[i])) {
      result++;
    }
  }
  return result;
}
