import { useEffect, useRef, useState } from 'react';

export function useAsyncData<Args, Data = any>(
  { enabled: inEnabled = true }: { enabled?: boolean } = { enabled: true },
) {
  const [state, setState] = useState<{
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error?: Error;
    args?: Args;
    data?: Data;
  }>({ args: undefined, isLoading: false, isSuccess: false, isError: false });

  const prepareContractWriteRef = useRef<any>();
  const contractWriteRef = useRef<any>();
  const submitStateRef = useRef<{ write: boolean }>({ write: false });

  function reset() {
    setState({ isLoading: false, isSuccess: false, isError: false });
  }
  function submit({ args }: { args: Args }) {
    submitStateRef.current.write = false;
    setState({ args, isLoading: true, isSuccess: false, isError: false });
  }
  function onSuccess(data?: Data) {
    setState({ args: undefined, data, isLoading: false, isSuccess: true, isError: false });
  }
  function onError(error: Error) {
    setState({ args: undefined, isLoading: false, isSuccess: false, isError: true, error });
  }

  const enabled = inEnabled && state.isLoading;

  function getPrepareContractWriteOptions<T>({ args }: { args?: T } = {}) {
    return { args: (enabled ? args : undefined) as T | undefined, enabled, onError };
  }

  function getContractWriteOptions(prepareContractWrite: any) {
    prepareContractWriteRef.current = prepareContractWrite;
    return {
      ...(prepareContractWrite.config as any),
      onError,
    };
  }

  function getWaitForTransactionOptions(contractWrite: any) {
    contractWriteRef.current = contractWrite;
    return {
      hash: contractWrite.data?.hash,

      onError,
      onSuccess: () => {
        onSuccess();
      },
    };
  }

  useEffect(() => {
    let id: any;
    function write() {
      if (prepareContractWriteRef.current?.status === 'success') {
        if (!contractWriteRef.current?.write) {
          console.warn('write is not ready yet, retrying in 500ms');
          id = setTimeout(write, 500);
          return;
        }
        if (submitStateRef.current.write) return;
        submitStateRef.current.write = true;
        contractWriteRef.current.write();
      }
    }

    write();
    return () => {
      clearTimeout(id);
    };
  }, [prepareContractWriteRef.current?.status]);

  const errorReason = getErrorReason(state.error as any);

  return {
    reset,
    submit,
    getPrepareContractWriteOptions,
    getContractWriteOptions,
    getWaitForTransactionOptions,
    state: {
      ...state,
      enabled,
      errorReason,
    },
  };
}

function getErrorReason(error?: any): string {
  return (
    error?.error?.data?.message ??
    //
    error?.error?.message ??
    error?.message ??
    'unknow error'
  );
}
