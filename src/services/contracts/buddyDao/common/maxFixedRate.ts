import type { ReadContractResult } from '@wagmi/core';
import { useContractRead } from 'wagmi';
import { abi } from '../abi';
import { BuddyDaoAddress } from '../constants';

export type MaxFixedRate = ReadContractResult<typeof abi, 'MaxFixedRate'>;

export function useMaxFixedRate({ enabled = true }: { enabled?: boolean } = {}) {
  const read = useContractRead({
    address: BuddyDaoAddress,
    abi,
    functionName: 'MaxFixedRate',
    enabled,
  });

  return read;
}
