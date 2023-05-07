'use client';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Modal } from '@/components/ui/Modal';
import classNames from 'classnames';
import { useRepaymentModalStore } from './store';
import { Detail, DetailItem } from '../Detail';
import { useAccount, useBalance, useToken } from 'wagmi';
import { useRepay } from '@/services/contracts/buddyDao/lenders/repay';
import { BigNumber, utils } from 'ethers';
import { useEffect, useMemo } from 'react';
import { useTokenValue } from '@/hooks/useTokenValue';
import { ApproveModal, useApproveModalStore } from '@/components/approve/ApproveModal';
import { useAllowance } from '@/services/contracts/token/allowance';
import { roundNumber } from '@/utils/roundNumber';

export function RepaymentModal() {
  const { isOpen, lender, payAmount, close, setPayAmount } = useRepaymentModalStore();

  const { open: openApproveModal } = useApproveModalStore();

  const { isLoading: isAllowanceLoading, data: allowance } = useAllowance({ address: lender?.Token, enabled: isOpen });
  const isAllowance = Boolean(allowance?.gt(0));

  const { data: token } = useToken({ address: lender?.Token });

  // owed
  const owedUI = useTokenValue({ address: lender?.Token, value: lender?.Amount, isShowName: true });

  // balance
  const { address } = useAccount();
  const { data: balance } = useBalance({
    enabled: isOpen && address && lender?.Token !== undefined,
    address,
    token: lender?.Token,
    watch: true,
    cacheTime: 5_000,
  });

  // payAmount
  const payAmountValue = useMemo(() => {
    try {
      if (!token) return;
      const value = utils.parseUnits(payAmount, token.decimals);
      return value.gt(utils.parseUnits('0', token.decimals)) ? value : undefined;
    } catch (error) {}
  }, [payAmount, token]);
  const payAmountUI = useTokenValue({ address: lender?.Token, value: payAmountValue });

  // new owed
  const newOwedValue = lender && payAmountValue && lender.Amount.sub(payAmountValue);
  const newOwedUI = useTokenValue({
    address: lender?.Token,
    value: newOwedValue,
    isShowSymbol: true,
    fallback: '-',
  });

  const { submit, reset, isLoading, isSuccess, error, errorReason } = useRepay({
    enabled: isOpen,
  });

  function handleSubmit() {
    if (!isAllowance) {
      if (!lender?.Token) throw new Error(`openApproveModal: lender.Token is not exist`);
      openApproveModal({ tokenAddress: lender.Token });
      return;
    }

    if (!lender || !payAmountValue) {
      throw new Error('Invalid data');
    }

    const args = {
      lendAddress: lender.Creditors,
      index: BigNumber.from(lender.borrowerIndex),
      payAmount: payAmountValue,
    };

    submit({
      args,
    });
  }

  useEffect(() => {
    reset();
  }, [isOpen]);

  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess]);

  const btnDisabled = Boolean(isAllowanceLoading || isLoading);

  return (
    <>
      <Modal
        open={isOpen}
        title="How much do you want to pay?"
        footer={
          <>
            <Button
              variant="contained"
              shape="square"
              size="medium-1"
              block
              disabled={btnDisabled}
              onClick={handleSubmit}
            >
              Pay {payAmountUI}
              {isLoading && '(loading...)'}
            </Button>

            {error && <div className={styles.errorMsg}>{errorReason}</div>}
          </>
        }
        onClose={close}
      >
        {lender && (
          <div className={styles.content}>
            <div className={styles.row_2col}>
              <TextField label="BALANCE OWED" disabled value={owedUI} />
              <TextField label={<>{token?.symbol} IN WALLET</>} disabled value={roundNumber(balance?.formatted)} />
            </div>

            <TextField
              label="Custom Payment Amount"
              value={payAmount}
              type="number"
              onChange={(val) => setPayAmount(val)}
            />

            <Detail>
              <DetailItem label="New Balance Owed:" value={newOwedUI} />
            </Detail>
          </div>
        )}
      </Modal>
      <ApproveModal />
    </>
  );
}

const styles = {
  content: classNames('flex', 'flex-col'),
  row_2col: classNames('grid', 'grid-cols-2', 'gap-[60px]'),

  detail: classNames('mt-', 'flex', 'flex-col', 'gap-[12px]'),

  errorMsg: classNames('text-red-500', 'text-sm', 'mt-2'),
};
