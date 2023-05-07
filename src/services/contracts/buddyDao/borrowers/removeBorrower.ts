import type { AbiParams } from '@/abis';
import { mapValue } from '@/abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { abi } from '../abi';
import { BuddyDaoAddress } from '../constants';
import { useAsyncData } from '@/hooks/useAsyncData';

export function useRemoveBorrower({ enabled }: { enabled?: boolean }) {
  const {
    state,
    state: { args },
    reset,
    submit,
    getPrepareContractWriteOptions,
    getContractWriteOptions,
    getWaitForTransactionOptions,
  } = useAsyncData<AbiParams<typeof abi, 'RemoveTrust'>>({ enabled });

  const writeArgs = args ? mapValue(args) : undefined;
  const prepareContractWrite = usePrepareContractWrite({
    address: BuddyDaoAddress,
    abi,
    functionName: 'RemoveTrust',
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
