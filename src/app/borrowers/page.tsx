'use client';

import { PageTable } from './_components/PageTable';
import { NewModal } from './_components/NewModal';
import { RemoveModal } from './_components/RemoveModal';
import { PageToolbar } from './_components/PageToolbar';
import { ClientOnly } from '@/components/common/ClientOnly';

export default function LendersPage() {
  return (
    <ClientOnly>
      <div>
        <PageToolbar />
        <PageTable />
      </div>
      <NewModal />
      <RemoveModal />
    </ClientOnly>
  );
}
