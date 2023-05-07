'use client';

import type { BigNumber } from 'ethers';
import type { FetchTokenResult } from '@wagmi/core';
import type { Control } from 'react-hook-form';
import type { NewBorrowerFormData } from './store';

import { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Modal } from '@/components/ui/Modal';
import { SelectField } from '@/components/ui/SelectField';
import { useNewBorrower } from '@/services/contracts/buddyDao/borrowers/newBorrower';
import { tokens } from '@/services/tokens';
import { useNewModalStore } from './store';
import { utils } from 'ethers';
import { useToken } from 'wagmi';
import { isValidAddress } from '@/utils/isValidAddress';
import { waitValue } from '@/utils/waitValue';
import { useMaxFixedRate } from '@/services/contracts/buddyDao/common/maxFixedRate';
import { useAllowance } from '@/services/contracts/token/allowance';
import { ApproveModal, useApproveModalStore } from '@/components/approve/ApproveModal';

export function NewModal() {
  const { isOpen, close } = useNewModalStore();
  const { open: openApproveModal } = useApproveModalStore();

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const { data: maxFixedRate } = useMaxFixedRate({ enabled: isOpen });

  const { control, handleSubmit, reset, watch } = useForm<NewBorrowerFormData>({
    defaultValues: { token: tokens[0].address, fixedRate: '10' },
  });

  const tokenAddress = watch('token');
  const { data: tokenData } = useToken({ address: tokenAddress });

  const {
    submit,
    reset: resetNewBorrower,
    error,
    errorReason,
    isLoading,
    isSuccess,
  } = useNewBorrower({
    enabled: isOpen,
  });

  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isOpen) {
      resetNewBorrower();
    }
  }, [isOpen]);

  const { isLoading: isAllowanceLoading, data: allowance } = useAllowance({ address: tokenAddress, enabled: isOpen });

  const isAllowance = Boolean(allowance?.gt(0));

  const btnDisabled = Boolean(isAllowanceLoading || isLoading);

  const formSubmit = handleSubmit(async (data) => {
    if (!isAllowance) {
      if (!tokenAddress) throw new Error(`NewModal: openApproveModal tokenAddress is not existt`);
      openApproveModal({ tokenAddress });
      return;
    }
    if (!tokenData?.decimals) throw new Error('Token decimals is not defined');
    submit({
      args: [
        { name: 'approveAddress', value: data.address as `0x${string}` },
        { name: 'alias', value: data.alias as string },
        { name: 'token', value: data.token as `0x${string}` },
        { name: 'fixedRate', value: utils.parseUnits(data.fixedRate, 16) },
        { name: 'amount', value: utils.parseUnits(data.amount, tokenData.decimals) },
      ],
    });
  });

  return (
    <>
      <Modal
        open={isOpen}
        title="New Borrower?"
        footer={
          <>
            <Button
              variant="contained"
              shape="square"
              size="medium-1"
              block
              disabled={btnDisabled}
              onClick={formSubmit}
            >
              Confirm
              {isAllowanceLoading ? '(preparing)' : ''}
              {isLoading ? '(loading)' : ''}
            </Button>
            {error && <div className={styles.errorMsg}>{errorReason}</div>}
          </>
        }
        onClose={close}
      >
        <div className={styles.content}>
          <NewForm control={control} maxFixedRate={maxFixedRate} tokenData={tokenData} />
        </div>
      </Modal>

      <ApproveModal />
    </>
  );
}

const NewForm = ({
  control,
  maxFixedRate,
  tokenData,
}: {
  control: Control<NewBorrowerFormData, any>;
  maxFixedRate?: BigNumber;
  tokenData?: FetchTokenResult;
}) => {
  const options = useMemo(() => tokens.map((token) => ({ label: token.label, value: token.address })), tokens);

  return (
    <>
      {/* Address */}
      <Controller<NewBorrowerFormData>
        name="address"
        control={control}
        rules={{
          required: 'Address is required',
          validate: {
            validAddress: (value) => isValidAddress(value) || 'invalid address',
          },
        }}
        render={({ field, fieldState }) => {
          return (
            <TextField
              label="Address:"
              maxLength={42}
              value={field.value}
              error={fieldState.error?.message}
              onChange={field.onChange}
            />
          );
        }}
      />

      {/* Alias */}
      <Controller<NewBorrowerFormData>
        name="alias"
        control={control}
        rules={{
          required: 'Alias is required',
        }}
        render={({ field, fieldState }) => {
          return (
            <TextField
              label="Alias:"
              maxLength={30}
              value={field.value}
              error={fieldState.error?.message}
              onChange={field.onChange}
            />
          );
        }}
      />

      {/* Token */}
      <Controller<NewBorrowerFormData>
        name="token"
        control={control}
        rules={{
          required: 'Token is required',
        }}
        render={({ field, fieldState }) => {
          return (
            <SelectField
              className={styles.tokenSelect}
              label="Token"
              error={fieldState.error?.message}
              options={options}
              value={field.value}
              onChange={field.onChange}
            />
          );
        }}
      />

      {/* Fixed Rate */}
      <Controller<NewBorrowerFormData>
        name="fixedRate"
        control={control}
        rules={{
          required: 'Fixed Rate is required',
          validate: {
            validRate: (value) => {
              try {
                const parsedValue = utils.parseUnits(value, 16);
                if (parsedValue.lte(0)) {
                  // greater than 0
                  return 'Fixed Rate must be greater than 0';
                }

                if (maxFixedRate && parsedValue.gt(maxFixedRate)) {
                  return `Fixed Rate must be less than ${utils.formatUnits(maxFixedRate, 16)}`;
                }
              } catch (error) {
                return 'Invalid Fixed Rate';
              }
            },
          },
        }}
        render={({ field, fieldState }) => {
          return (
            <TextField
              label={<>Fixed Rate</>}
              type="number"
              maxLength={10}
              addAfter="%"
              value={field.value}
              error={fieldState.error?.message}
              onChange={field.onChange}
            />
          );
        }}
      />

      {/* Credit Amount */}
      <Controller<NewBorrowerFormData>
        name="amount"
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
                  return 'Amount must be greater than 0';
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
              label="Credit Amount:"
              type="number"
              maxLength={50}
              value={field.value}
              error={fieldState.error?.message}
              onChange={field.onChange}
            />
          );
        }}
      />
    </>
  );
};

const styles = {
  content: classNames('flex', 'flex-col'),
  tokenSelect: classNames('w-[200px]'),

  errorMsg: classNames('text-red-500', 'text-sm', 'mt-2'),
};
