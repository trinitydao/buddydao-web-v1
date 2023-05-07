'use client';

import { Toolbar } from '@/components/ui/Toolbar';
import { useMounted } from '@/hooks/useMounted';
import { PageTable } from './_components/PageTable';
import { BorrowModal } from './_components/BorrowModal';
import { RepaymentModal } from './_components/RepaymentModal';
import { ClientOnly } from '@/components/common/ClientOnly';

export default function LendersPage() {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <ClientOnly>
      <div>
        <Toolbar />
        <PageTable />
        <BorrowModal />
        <RepaymentModal />
      </div>
    </ClientOnly>
  );
}
