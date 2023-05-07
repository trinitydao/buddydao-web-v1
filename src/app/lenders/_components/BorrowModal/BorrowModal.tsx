'use client';
import type { FetchTokenResult } from '@wagmi/core';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Modal } from '@/components/ui/Modal';
import classNames from 'classnames';
import { useForm, Controller } from 'react-hook-form';
import { useBorrowModalStore } from './store';
import { Detail, DetailItem } from '../Detail';
import { useBorrow } from '@/services/contracts/buddyDao/lenders/borrow';
import { BigNumber, utils } from 'ethers';
import { useEffect } from 'react';
import { useTokenValue } from '@/hooks/useTokenValue';
import { useAccount, useToken } from 'wagmi';
import { useCalculatingInterest } from '@/services/contracts/buddyDao/lenders/calculatingInterest';
import { useApproveModalStore } from '@/components/approve/ApproveModal';
import { useAllowance } from '@/services/contracts/token/allowance';

interface BorrowFormData {
  amount: string;
}

export function BorrowModal() {
  const { isOpen, lender, close } = useBorrowModalStore();
  const lenderAddress = lender?.Creditors;

  const { open: openApproveModal } = useApproveModalStore();

  const { isLoading: isAllowanceLoading, data: allowance } = useAllowance({ address: lender?.Token, enabled: isOpen });
  const isAllowance = Boolean(allowance?.gt(0));

  const { control, handleSubmit, reset, watch } = useForm<BorrowFormData>({
    mode: 'onChange',
    defaultValues: { amount: '0' },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const borrowAmount = watch('amount');

  const { data: token } = useToken({ address: lender?.Token });

  // avaliable credit
  const avaliableCreditUI = useTokenValue({ address: lender?.Token, value: lender?.CreditLine, isShowSymbol: true });

  // you owe
  const youOweUI = useTokenValue({ address: lender?.Token, value: lender?.Amount, isShowSymbol: true });

  // max borrow
  const maxBorrowValue = lender?.CreditLine.sub(lender?.Amount);
  const maxBorrowUi = useTokenValue({
    address: lender?.Token,
    value: maxBorrowValue,
    isShowSymbol: true,
  });

  // borrow amount
  function parseBorrowAmount(value: string) {
    if (!token || !maxBorrowValue) throw new Error('not ready, please try again');

    let parsedValue;
    try {
      parsedValue = utils.parseUnits(value, token.decimals);
    } catch (error) {
      throw new Error(`Borrow invalid`, { cause: error });
    }

    if (parsedValue.lte(0)) {
      throw new Error('Borrow must be greater than 0');
    }
    if (parsedValue.gt(maxBorrowValue)) {
      throw new Error(`Borrow must be less than ${maxBorrowUi}`);
    }
    return parsedValue;
  }
  let borrowValue: BigNumber | undefined;
  try {
    borrowValue = parseBorrowAmount(borrowAmount);
  } catch (error) {}

  // fee
  const fee = useFee({
    lenderAddress,
    borrowerIndex: lender ? BigNumber.from(lender.borrowerIndex) : undefined,
    borrowAmount: borrowValue,
    token,
  });

  // fixedRate
  const fixedRateUI = lender ? `${utils.formatUnits(lender.FixedRate, 16)}%` : '-';

  // newBalanceOwed
  const newBalanceOwedValue = lender && borrowValue && lender.Amount.add(borrowValue);
  const newBalanceOwedUI = useTokenValue({
    address: lender?.Token,
    value: newBalanceOwedValue,
    isShowSymbol: true,
    fallback: '-',
  });

  const {
    submit,
    reset: resetBorrow,
    isLoading,
    isSuccess,
    error,
    errorReason,
  } = useBorrow({
    enabled: isOpen,
  });

  const formSubmit = handleSubmit(async () => {
    if (!isAllowance) {
      if (!lender?.Token) throw new Error(`openApproveModal: lender.Token is not exist`);
      openApproveModal({ tokenAddress: lender.Token });
      return;
    }

    if (!lender || !borrowValue) {
      throw new Error('lender or borrowValue is undefined');
    }

    const args = {
      lendAddress: lender.Creditors,
      index: BigNumber.from(lender.borrowerIndex),
      borrowerAmount: borrowValue,
    };
    submit({ args });
  });

  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess]);

  useEffect(() => {
    resetBorrow();
  }, [isOpen]);

  const btnDisabled = Boolean(isAllowanceLoading || isLoading);

  return (
    <Modal
      open={isOpen}
      title="How much do you want to borrow?"
      footer={
        <>
          <Button variant="contained" shape="square" size="medium-1" block disabled={btnDisabled} onClick={formSubmit}>
            Borrow funds
            {isLoading && '(loading...)'}
          </Button>

          {error && <div className={styles.errorMsg}>{errorReason}</div>}
        </>
      }
      onClose={close}
    >
      {lender && (
        <div className={styles.content}>
          <div>
            <div className={styles.row_2col}>
              <TextField label="AVAILABLE CREDIT" disabled value={avaliableCreditUI} />
              <TextField label="TOTAL BORROW AMOUNT" disabled value={youOweUI} />
            </div>

            <Controller<BorrowFormData>
              name="amount"
              control={control}
              rules={{
                required: 'Borrow is required',
                validate: (value) => {
                  try {
                    parseBorrowAmount(value);
                  } catch (error) {
                    if (error instanceof Error) {
                      return error.message;
                    }
                    return 'invalid';
                  }
                },
              }}
              render={({ field, fieldState }) => {
                return (
                  <TextField
                    label={<>Borrow (Max {maxBorrowUi})</>}
                    value={field.value}
                    type="number"
                    error={fieldState.error?.message}
                    onChange={field.onChange}
                  />
                );
              }}
            />
          </div>

          <Detail>
            <DetailItem label="Fee:" value={fee.uiValue} />
            <DetailItem label="Interest Rate:" value={fixedRateUI} />
            <DetailItem label="New Balance Owed:" value={newBalanceOwedUI} />
          </Detail>
        </div>
      )}
    </Modal>
  );
}

function useFee({
  lenderAddress,
  borrowerIndex,
  borrowAmount,
  token,
}: {
  lenderAddress?: `0x${string}`;
  borrowerIndex?: BigNumber;
  borrowAmount?: BigNumber;
  token?: FetchTokenResult;
}) {
  const { address: accountAddress } = useAccount();

  const args =
    lenderAddress && accountAddress && borrowAmount && borrowerIndex
      ? {
          lendAddress: lenderAddress,
          borrower: accountAddress,
          index: borrowerIndex,
          payAmount: borrowAmount,
        }
      : undefined;

  const { data } = useCalculatingInterest({ enabled: !!args, args });
  const interestValue = token && data && utils.formatUnits(data, token.decimals);

  const uiInterest = !args ? '-' : interestValue ? `${interestValue} ${token?.symbol}` : 'loading';

  return {
    uiValue: uiInterest,
  };
}

const styles = {
  content: classNames('flex', 'flex-col', 'gap-[24px]'),
  row_2col: classNames('grid', 'grid-cols-2', 'gap-[60px]'),
  errorMsg: classNames('text-red-500', 'text-sm', 'mt-2'),
};
