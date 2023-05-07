import type { ReactNode, FC } from 'react';
import { useMounted } from '@/hooks/useMounted';

export const ClientOnly: FC<{ children: ReactNode }> = ({ children }) => {
  const mounted = useMounted();

  // Render
  if (!mounted) return null;

  return children as JSX.Element;
};
