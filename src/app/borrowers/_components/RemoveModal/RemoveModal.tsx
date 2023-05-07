'use client';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TextField } from '@/components/ui/TextField';
import { useTokenValue } from '@/hooks/useTokenValue';
import { addressTextOverflow } from '@/services/address';
import { useRemoveBorrower } from '@/services/contracts/buddyDao/borrowers/removeBorrower';
import { waitValue } from '@/utils/waitValue';
import classNames from 'classnames';
import { BigNumber, utils } from 'ethers';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAccount, useToken } from 'wagmi';
import { useRemoveModalStore } from './store';

export interface RemoveBorrowerFormData {
  cancelAmount: string;
}

export function RemoveModal() {
  const { isOpen, borrower, close } = useRemoveModalStore();

  const { address: accountAddress } = useAccount();
  const borrowerAddress = borrower?.Address;

  const {
    submit,
    reset: resetRemoveBorrower,
    error,
    errorReason,
    isLoading,
    isSuccess,
  } = useRemoveBorrower({
    enabled: isOpen,
  });

  const handleClose = close;

  useEffect(() => {
    resetRemoveBorrower();
  }, [isOpen]);

  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess]);

  // token
  const { data: tokenData } = useToken({ address: borrower?.Token });

  // maxCancelAmount
  const maxCancelAmountValue = useMemo(() => {
    if (!borrower) return;
    return borrower.CreditLine.sub(borrower.Amount);
  }, [borrower]);
  const maxCancelAmountUi = useTokenValue({
    address: borrower?.Token,
    value: maxCancelAmountValue,
    isShowSymbol: true,
  });

  const {
    control,
    handleSubmit,
    reset: resetForm,
    setValue,
  } = useForm<RemoveBorrowerFormData>({
    defaultValues: { cancelAmount: '' },
  });

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // set default cancel amount
  useEffect(() => {
    if (!maxCancelAmountValue || !tokenData) return;

    setValue('cancelAmount', utils.formatUnits(maxCancelAmountValue, tokenData.decimals));
  }, [maxCancelAmountValue]);

  const formSubmit = handleSubmit(async (data) => {
    if (!tokenData || !accountAddress || !borrowerAddress) throw new Error('remove error');

    const cancelAmountValue = utils.parseUnits(data.cancelAmount, tokenData.decimals);

    submit({
      args: [
        { name: 'approveAddress', value: borrower.Address },
        { name: 'index', value: BigNumber.from(borrower.borrowerIndex) },
        { name: 'cancelAmount', value: cancelAmountValue },
      ],
    });
  });

  return (
    <Modal
      open={isOpen}
      title="Manage contact"
      footer={
        <>
          <Button variant="contained" shape="square" size="medium-1" block disabled={isLoading} onClick={formSubmit}>
            Remove from contacts
            {isLoading ? '(loading)' : ''}
          </Button>
          {error && <div className={styles.errorMsg}>{errorReason}</div>}
        </>
      }
      onClose={handleClose}
    >
      {borrower && (
        <div className={styles.content}>
          <UserInfo alias={borrower.Alias} address={borrower.Address} />

          <div>
            <TextField label="Interest Rate" disabled value={`${utils.formatUnits(borrower.FixedRate, 16)}%`} />

            <Controller<RemoveBorrowerFormData>
              name="cancelAmount"
              control={control}
              rules={{
                required: 'Credit Amount is required',
                validate: {
                  validRate: async (value) => {
                    const token = await waitValue(() => tokenData);
                    try {
                      const parsedValue = utils.parseUnits(value, token.decimals);
                      if (parsedValue.lte(0)) {
                        // greater than 0
                        return 'CancelAmount must be greater than 0';
                      }

                      // ensure >= 0
                      if (parsedValue.lte(utils.parseUnits('0', token.decimals))) {
                        return 'CancelAmount must be greater than 0';
                      }

                      // less than or equal to max cancel amount
                      const maxCancelAmount = await waitValue(() => maxCancelAmountValue);
                      if (parsedValue.gt(maxCancelAmount)) {
                        return 'CancelAmount must be less than or equal to Max Remove Amount';
                      }
                    } catch (error) {
                      return 'Invalid Amount';
                    }
                  },
                },
              }}
              render={({ field, fieldState }) => {
                return (
                  <TextField
                    label={`Credit Amount (Max Remove Amount ${maxCancelAmountUi})`}
                    type="number"
                    maxLength={50}
                    value={field.value}
                    error={fieldState.error?.message}
                    onChange={field.onChange}
                  />
                );
              }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

const styles = {
  content: classNames('flex', 'flex-col', 'gap-[24px]'),

  errorMsg: classNames('text-red-500', 'text-sm', 'mt-2'),
};

// ---------------- User info ----------------
function UserInfo({ alias, address }: { alias: string; address: string }) {
  return (
    <div className={userInfoStyles.userInfo}>
      <div className={userInfoStyles.avatar}>
        <Avatar />
      </div>
      <div className={userInfoStyles.right}>
        <div className={userInfoStyles.alias}>{alias}</div>
        <div className={userInfoStyles.address}>{addressTextOverflow(address)}</div>
      </div>
    </div>
  );
}
const userInfoStyles = {
  userInfo: classNames('h-[60px]', 'flex', 'gap-[12px]'),
  avatar: classNames('min-w-fit'),
  right: classNames('flex', 'flex-col', 'justify-between', 'overflow-hidden'),
  alias: classNames('text-[#333333]', 'font-bold', 'text-[30px]', 'leading-none'),
  address: classNames(
    'items-center',
    'rounded-full',
    'h-[22px]',
    'bg-[#F8F8F8]',
    'px-[12px]',
    'text-[#999999]',
    'text-[13px]',
    'truncate',
  ),
};
