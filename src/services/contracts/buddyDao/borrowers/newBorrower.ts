import type { AbiParams } from '@/abis';
import { mapValue } from '@/abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useAsyncData } from '@/hooks/useAsyncData';
import { abi } from '../abi';
import { BuddyDaoAddress } from '../constants';

export function useNewBorrower({ enabled = true }: { enabled?: boolean }) {
  const {
    state,
    state: { args },
    reset,
    submit,
    getPrepareContractWriteOptions,
    getContractWriteOptions,
    getWaitForTransactionOptions,
  } = useAsyncData<AbiParams<typeof abi, 'NewTrust'>>({ enabled });

  const writeArgs = args ? mapValue(args) : undefined;

  const prepareContractWrite = usePrepareContractWrite({
    address: BuddyDaoAddress,
    abi,
    functionName: 'NewTrust',
    ...getPrepareContractWriteOptions({ args: writeArgs }),
  });

  const contractWrite = useContractWrite(getContractWriteOptions(prepareContractWrite));

  const waitForTransacttion = useWaitForTransaction(getWaitForTransactionOptions(contractWrite));

  return { reset, submit, waitForTransacttion, ...state };
}
