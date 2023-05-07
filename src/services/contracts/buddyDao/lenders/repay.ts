import { BigNumber } from 'ethers';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useAsyncData } from '@/hooks/useAsyncData';
import { abi } from '../abi';
import { BuddyDaoAddress } from '../constants';

export function useRepay({ enabled }: { enabled?: boolean }) {
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
    payAmount: BigNumber;
  }>({ enabled });

  const writeArgs = args ? ([args.lendAddress, args.index, args.payAmount] as const) : undefined;

  const prepareContractWrite = usePrepareContractWrite({
    address: BuddyDaoAddress,
    abi,
    functionName: 'Pay',
    ...getPrepareContractWriteOptions({ args: writeArgs }),
  });

  const contractWrite = useContractWrite(getContractWriteOptions(prepareContractWrite));

  useWaitForTransaction(getWaitForTransactionOptions(contractWrite));

  return { reset, submit, ...state };
}
