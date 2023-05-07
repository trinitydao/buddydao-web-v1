import type { AbiParams } from '@/abis';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { mapValue } from '@/abis';
import { useAsyncData } from '@/hooks/useAsyncData';
import { abi } from './abi';

export function useApprove({ address, enabled = true }: { address?: `0x${string}`; enabled?: boolean }) {
  const {
    state,
    state: { args },
    reset,
    submit,
    getPrepareContractWriteOptions,
    getContractWriteOptions,
    getWaitForTransactionOptions,
  } = useAsyncData<AbiParams<typeof abi, 'approve'>>({ enabled });

  const writeArgs = args ? mapValue(args) : undefined;

  const prepareContractWrite = usePrepareContractWrite({
    address,
    abi,
    functionName: 'approve',
    ...getPrepareContractWriteOptions({ args: writeArgs }),
  });

  const contractWrite = useContractWrite(getContractWriteOptions(prepareContractWrite));

  const waitForTransacttion = useWaitForTransaction(getWaitForTransactionOptions(contractWrite));

  return { reset, submit, waitForTransacttion, ...state };
}
