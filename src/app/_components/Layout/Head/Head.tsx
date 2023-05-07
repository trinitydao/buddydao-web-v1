'use-client';

import 'client-only';
import classNames from 'classnames';
import Image from 'next/image';

import logoImg from '@/assets/logo.jpg';
import { Account } from './Account';
import { Tabs } from './Tabs';
import { HEAD_HEIGHT } from '../constants';
import { useMounted } from '@/hooks/useMounted';

export function Head() {
  const mounted = useMounted();

  return (
    <div className={styles.head} style={{ ...({ '--head-height': `${HEAD_HEIGHT}px` } as any) }}>
      <div className={styles.content}>
        {/* Logo */}
        <Image className={styles.logo} alt="logo" src={logoImg} width={103} height={52} />

        {/* Tab */}
        <div className={styles.tabs}>
          <Tabs />
        </div>

        {/* Account */}
        <div className={styles.account}>{mounted && <Account />}</div>
      </div>
    </div>
  );
}

const styles = {
  head: classNames(
    'fixed',
    'z-10',
    'top-0',
    'left-0',
    'w-screen',
    'border-b',
    'flex',
    'justify-center',
    'bg-white',
    `h-[var(--head-height)]`,
    'border-b-[#CCCCCC]',
  ),

  content: classNames(
    'h-full',
    'flex',
    'flex-row',
    'items-center',
    'justify-between',
    'px-6',
    'm-w-[1200px]',
    'w-full',
  ),
  logo: classNames('sm:block', 'hidden'),

  tabs: classNames('flex', 'justify-center'),

  account: classNames(),
};
