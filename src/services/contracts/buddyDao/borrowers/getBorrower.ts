import type { ReadContractResult } from '@wagmi/core';
import { useAccount, useContractRead, useContractReads } from 'wagmi';
import { abi } from '../abi';
import { BuddyDaoAddress } from '../constants';

export type Lender = ReadContractResult<typeof abi, 'GetLenderData'>[number];
export type TableLender = Lender & {
  borrowerIndex: number;
};

/**
 * 获取你的借款人列表
 */
export function useBorowers() {
  const { address: accountAddress } = useAccount();

  const enabled = typeof window !== 'undefined' && Boolean(accountAddress);

  let args;
  if (accountAddress) {
    args = [accountAddress] as const;
  }

  const result1 = useContractRead({
    address: BuddyDaoAddress,
    abi,
    functionName: 'GetLenderAddress',
    args,
    watch: true,
    enabled,
  });

  const result = useContractReads({
    watch: true,
    contracts:
      result1.data?.map((address) => ({
        address: BuddyDaoAddress,
        abi,
        functionName: 'GetLenderData',
        args: [accountAddress, address],
      })) ?? [],
  });

  const data = result.data
    ?.map((_arr) => {
      const arr = (_arr ?? []) as Lender[];
      return arr?.map((item, index) => {
        const tableData: TableLender = {
          ...item,
          borrowerIndex: index,
        };
        return tableData;
      });
    })
    ?.flat(1);

  return {
    ...result,
    data,
  };
}
