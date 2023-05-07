import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { BigNumber } from 'ethers';
import { useAsyncData } from '@/hooks/useAsyncData';
import { abi } from '../abi';
import { BuddyDaoAddress } from '../constants';

export function useBorrow({ enabled }: { enabled?: boolean }) {
  const {
    state,
    state: { args },
    reset,
    submit,
    getPrepareContractWriteOptions,
    getContractWriteOptions,
    getWaitForTransactionOptions,
  } = useAsyncData<{
    lendAddress: `0x${string}`;
    index: BigNumber;
    borrowerAmount: BigNumber;
  }>({ enabled });

  const writeArgs = args && ([args.lendAddress, args.index, args.borrowerAmount] as const);

  const prepareContractWrite = usePrepareContractWrite({
    address: BuddyDaoAddress,
    abi,
    functionName: 'Withdrawal',
    ...getPrepareContractWriteOptions({ args: writeArgs }),
  });

  const contractWrite = useContractWrite(getContractWriteOptions(prepareContractWrite));

  useWaitForTransaction(getWaitForTransactionOptions(contractWrite));

  return {
    submit,
    reset,
    ...state,
  };
}
