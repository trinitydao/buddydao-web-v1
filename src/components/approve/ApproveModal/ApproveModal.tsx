import { FC, useEffect } from 'react';

import classNames from 'classnames';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useApprove } from '@/services/contracts/token/approve';
import { useApproveModalStore } from './store';
import { BuddyDaoAddress } from '@/services/contracts/buddyDao/constants';
import { BigNumber } from 'ethers';

export const ApproveModal: FC = () => {
  const { isOpen, tokenAddress, close } = useApproveModalStore();

  const { submit, reset, error, errorReason, isLoading, isSuccess } = useApprove({
    address: tokenAddress,
    enabled: isOpen,
  });

  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const btnDisabled = Boolean(isLoading);

  async function formSubmit() {
    const maxUint256 = BigNumber.from(2).pow(256).sub(1);
    submit({
      args: [
        { name: 'spender', value: BuddyDaoAddress },
        { name: 'amount', value: maxUint256 },
      ],
    });
  }

  return (
    <Modal
      open={isOpen}
      title="Approve"
      footer={
        <>
          <Button variant="contained" shape="square" size="medium-1" block disabled={btnDisabled} onClick={formSubmit}>
            Approve
            {isLoading ? '(loading)' : ''}
          </Button>
          {error && <div className={styles.errorMsg}>{errorReason}</div>}
        </>
      }
      onClose={close}
    >
      Approval is required the first time you use
    </Modal>
  );
};

const styles = {
  errorMsg: classNames('text-red-500', 'text-sm', 'mt-2'),
};
