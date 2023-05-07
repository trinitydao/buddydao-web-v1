import type { FC } from 'react';
import { useTokenValue } from '@/hooks/useTokenValue';
import { BigNumber } from 'ethers';

export const TokenValue: FC<{
  address?: `0x${string}`;
  value?: BigNumber;
  isShowName?: boolean;
  isShowSymbol?: boolean;
  fallback?: string;
}> = ({ address, value, isShowName, isShowSymbol, fallback }) => {
  const showValue = useTokenValue({ address, value, isShowName, isShowSymbol, fallback });

  return <>{showValue}</>;
};
