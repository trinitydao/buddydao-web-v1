import { useEffect, useState } from 'react';

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  // Hooks
  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
