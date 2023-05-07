import { useContractRead } from 'wagmi';
import { BigNumber } from 'ethers';
import { mapValue } from '@/abis';
import { abi } from '../abi';
import { BuddyDaoAddress } from '../constants';

export function useCalculatingInterest({
  enabled,
  args,
}: {
  enabled?: boolean;
  args?: {
    lendAddress: `0x${string}`;
    borrower: `0x${string}`;
    index: BigNumber;
    payAmount: BigNumber;
  };
}) {
  const validArgs =
    args &&
    ([
      { name: 'lendAddress', value: args.lendAddress },
      { name: 'borrower', value: args.borrower },
      { name: 'index', value: args.index },
      { name: 'payAmount', value: args.payAmount },
    ] as const);

  const { data } = useContractRead({
    address: BuddyDaoAddress,
    abi,
    functionName: 'calculatingInterest',
    args: validArgs ? mapValue(validArgs) : undefined,
    enabled,
  });

  return {
    data,
  };
}
