'use client';

import { useAccountModalStore } from '@/components/account/AccountModal/store';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { addressTextOverflow } from '@/services/address';
import { createAvatar } from '@/services/avatar';
import classNames from 'classnames';
import { useAccount } from 'wagmi';

export function Account() {
  const { open } = useAccountModalStore();

  const { address, isConnected } = useAccount();

  function renderContent() {
    if (isConnected) {
      return (
        <div className={styles.account} onClick={open}>
          <Avatar src={address ? createAvatar(address) : undefined} />
          <div className={styles.address}>{addressTextOverflow(address)}</div>
        </div>
      );
    }

    return (
      <Button variant="outlined" onClick={open}>
        Connect Wallet
      </Button>
    );
  }

  return <div>{renderContent()}</div>;
}

const styles = {
  account: classNames('flex', 'items-center', 'gap-[12px]', 'cursor-pointer'),
  address: classNames('text-[#666666]', 'font-normal', 'text-sm'),
};
