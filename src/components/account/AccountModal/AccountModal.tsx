'use client';

import classNames from 'classnames';
import { Modal } from '@/components/ui/Modal';
import { Connector, useAccount, useEnsName, useDisconnect, useConnect } from 'wagmi';
import { Button } from '@/components/ui/Button';
import { useAccountModalStore } from './store';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar } from '@/components/ui/Avatar';
import { addressTextOverflow } from '@/services/address';
import { CopyToClipboard } from '@/components/ui/CopyToClipboard';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { useEffect } from 'react';
import { createAvatar } from '@/services/avatar';

const CONNECTOR_NAME_MAP = {
  WalletConnectLegacy: 'WalletConnect',
} as Record<string, string>;

export function AccountModal() {
  const { isOpen, onConnected, close } = useAccountModalStore();

  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      onConnected();
    }
  }, [isConnected]);

  function renderContent() {
    if (isConnected) return <LoggedIn />;

    return <SelectConnector />;
  }

  return (
    <Modal open={isOpen} title="Connect Wallet" onClose={close}>
      <div className={styles.content}>{renderContent()}</div>
    </Modal>
  );
}

/** 选择 */
function SelectConnector() {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const onClick = (connector: Connector) => () => {
    connect({ connector });
  };

  return (
    <div className={styles.connectors}>
      {connectors
        .filter((connector) => connector.ready)
        .map((connector) => (
          <Button key={connector.id} variant="contained" onClick={onClick(connector)}>
            <div className={styles.connectorItem}>
              <div>{CONNECTOR_NAME_MAP[connector.name] ?? connector.name}</div>
              {isLoading && connector.id === pendingConnector?.id && <Spinner color="white" />}
            </div>
          </Button>
        ))}
      {<div className={styles.errorMsg}>{error?.message}</div>}
    </div>
  );
}

const styles = {
  content: classNames('min-h-[120px]'),
  connectors: classNames('grid', 'gap-4'),
  connectorItem: classNames('flex', 'items-center', 'gap-2'),
  errorMsg: classNames('min-h-[24px]', 'text-base', 'text-red-500'),
};

/** 已登录 */
function LoggedIn() {
  const { address } = useAccount();
  // const { data: ensAvatar } = useEnsAvatar({ address });
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();

  const isEnsName = !!ensName;

  const handleDisconnect = () => {
    disconnect();
  };

  const addressEl = (
    <div className={loginInStyles.addressWrap}>
      <Tooltip placement="top">
        <TooltipTrigger>
          <span>{addressTextOverflow(address)}</span>
        </TooltipTrigger>
        <TooltipContent>{address}</TooltipContent>
      </Tooltip>
      <CopyToClipboard text={address ?? ''} />
    </div>
  );

  return (
    <div className={loginInStyles.content}>
      <div className={loginInStyles.account}>
        <Avatar src={address ? createAvatar(address) : undefined} alt="ENS Avatar" />
        <div>
          <div>{isEnsName ? ensName : addressEl}</div>
          <div>{isEnsName && addressEl}</div>
        </div>
      </div>
      <Button variant="contained" block onClick={handleDisconnect}>
        Disconnect
      </Button>
    </div>
  );
}

const loginInStyles = {
  content: classNames('flex', 'flex-col', 'gap-4'),
  account: classNames('flex', 'items-center', 'gap-4'),
  addressWrap: classNames('flex', 'items-center', 'gap-2'),
};
