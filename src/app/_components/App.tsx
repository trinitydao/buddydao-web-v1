'use client';

import 'client-only';

import type { PropsWithChildren } from 'react';
import { Layout } from './Layout';

import { WagmiConfig } from 'wagmi';
import { ClientService } from '@/services/client';
import { AccountModal } from '@/components/account/AccountModal';
import { NetworkModal } from '@/components/NetworkModal';

export function App({ children }: PropsWithChildren<{}>) {
  return (
    <WagmiConfig client={ClientService.client}>
      <Layout>{children}</Layout>
      <AccountModal />
      <NetworkModal />
    </WagmiConfig>
  );
}
