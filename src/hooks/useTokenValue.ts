import { BigNumber, utils } from 'ethers';
import { useToken } from 'wagmi';

export function useTokenValue({
  address,
  value,
  isShowName,
  isShowSymbol,
  fallback,
}: {
  address?: `0x${string}`;
  value?: BigNumber;
  isShowName?: boolean;
  isShowSymbol?: boolean;
  fallback?: string;
}) {
  const token = useToken({ enabled: !!address, address });

  const formatValue = value ? utils.formatUnits(value, token.data?.decimals) : undefined;
  if (!formatValue) return fallback;

  return `${formatValue ?? ''} ${isShowName ? token.data?.name : ''} ${isShowSymbol ? token.data?.symbol : ''}`;
}
