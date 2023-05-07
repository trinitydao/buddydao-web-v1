export function waitValue<T>(getValue: () => T, ms?: number): Promise<NonNullable<T>> {
  return new Promise<NonNullable<T>>((resolve) => {
    const interval = setInterval(() => {
      const value = getValue();
      if (value) {
        clearInterval(interval);
        resolve(value);
      }
    }, ms ?? 200);
  });
}
