import type { ReadContractResult } from '@wagmi/core';
import { useAccount, useContractRead } from 'wagmi';
import { BuddyDaoAddress } from '@/services/contracts/buddyDao/constants';
import { abi } from './abi';

export type AllowanceResult = ReadContractResult<typeof abi, 'allowance'>;

export function useAllowance({ address, enabled = true }: { address?: `0x${string}`; enabled?: boolean }) {
  const { address: accountAddress } = useAccount();

  let args;
  if (typeof window !== 'undefined' && enabled && accountAddress) {
    args = [accountAddress, BuddyDaoAddress] as const;
  }
  const contractEnabled = Boolean(args);

  const read = useContractRead({
    address,
    abi,
    functionName: 'allowance',
    args,
    watch: true,
    enabled: contractEnabled,
  });

  return read;
}
