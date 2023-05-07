'use client';

import { useMemo, useRef } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { CopyToClipboard } from '@/components/ui/CopyToClipboard';
import { addressTextOverflow } from '@/services/address';
import { useHover } from 'ahooks';
import classNames from 'classnames';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { createAvatar } from '@/services/avatar';

// show avatar alias and address
export function AliasTableColumn({ address, alias, avatar }: { avatar?: string; alias: string; address: string }) {
  const hoverRef = useRef<HTMLDivElement>(null);
  const isHover = useHover(hoverRef);

  const aratarSrc = useMemo(() => {
    return avatar ?? createAvatar(address);
  }, [avatar]);

  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <Avatar src={aratarSrc} size="small" />
      </div>
      <div className={styles.right}>
        <div className={styles.aliasName}>{alias}</div>
        <div ref={hoverRef} className={styles.aliasAddress}>
          <Tooltip>
            <TooltipTrigger>{addressTextOverflow(address)}</TooltipTrigger>
            <TooltipContent>{address}</TooltipContent>
          </Tooltip>

          {isHover && <CopyToClipboard text={address} />}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: classNames('flex', 'items-center', 'gap-[12px]'),
  avatar: classNames('min-w-fit'),
  right: classNames('flex-auto', 'flex', 'flex-col', 'gap-[4px]', 'overflow-hidden'),
  aliasName: classNames('text-[#333333]', 'font-bold', 'text-sm', 'truncate'),
  aliasAddress: classNames('flex', 'items-center', 'gap-2', 'text-[#666666]', 'font-normal', 'text-sm'),
};
