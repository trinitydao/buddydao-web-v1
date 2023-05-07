import { FC, ReactNode } from 'react';
import { useToken } from 'wagmi';

export const Token: FC<{
  address?: `0x${string}`;
  children?: (token: ReturnType<typeof useToken>) => ReactNode;
}> = ({ address, children }) => {
  const token = useToken({ enabled: !!address, address });

  return <>{children?.(token) ?? token.data?.symbol ?? null}</>;
};
