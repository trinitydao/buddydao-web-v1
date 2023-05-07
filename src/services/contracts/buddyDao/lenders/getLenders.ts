import type { ReadContractResult } from '@wagmi/core';
import { useAccount, useContractRead, useContractReads } from 'wagmi';
import { abi } from '../abi';
import { BuddyDaoAddress } from '../constants';

export type Borrower = ReadContractResult<typeof abi, 'GetBorrowerData'>[number];
export type TableBorrower = Borrower & {
  borrowerIndex: number;
};

/**
 * 获取你的放款人列表
 */
export function useLenders() {
  const { address: accountAddress } = useAccount();

  const enabled = typeof window !== 'undefined' && Boolean(accountAddress);

  let args;
  if (accountAddress) {
    args = [accountAddress] as const;
  }

  const result1 = useContractRead({
    address: BuddyDaoAddress,
    abi,
    functionName: 'GetBorrowerAddress',
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
        functionName: 'GetBorrowerData',
        args: [accountAddress, address],
      })) ?? [],
  });

  const data = result.data
    ?.map((_arr) => {
      const arr = (_arr ?? []) as Borrower[];
      return arr?.map((item, index) => {
        const tableData: TableBorrower = {
          ...(item as Borrower),
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
