'use client';
import { AliasTableColumn } from '@/components/alias/AliasTableColumn';
import { Token } from '@/components/contract/Token';
import { TokenValue } from '@/components/contract/TokenValue';
import { Button } from '@/components/ui/Button';
import { Table, TableActions } from '@/components/ui/Table';
import { useBorowers } from '@/services/contracts/buddyDao/borrowers/getBorrower';
import { utils } from 'ethers';
import { useRemoveModalStore } from './RemoveModal';

export function PageTable() {
  const { open: openRemoveModal } = useRemoveModalStore();

  const { data } = useBorowers();

  const tableData = data?.filter((item) => !item.isCancel);

  return (
    <Table
      columns={[
        {
          title: 'Alias',
          key: 'alias',
          align: 'left',
          minWidth: '250px',
          maxWidth: '400px',
          render: (record) => <AliasTableColumn alias={record.Alias} address={record.Address} />,
        },
        {
          title: 'Token',
          key: 'token',
          render: (record) => <Token address={record.Token} />,
        },
        {
          title: 'Credit amount',
          key: 'creditAmount',
          render(record) {
            return <TokenValue address={record.Token} value={record.CreditLine} />;
          },
        },
        {
          title: 'Available',
          key: 'available',
          render(record) {
            const actualAvailable = record.CreditLine.sub(record.Amount);
            return <TokenValue address={record.Token} value={actualAvailable} />;
          },
        },
        {
          title: 'Interest Rate',
          key: 'fixedRate',
          render(record) {
            return <>{utils.formatUnits(record.FixedRate, 16)}%</>;
          },
        },
        {
          key: 'actions',
          render: (record) => (
            <div>
              <TableActions>
                <Button variant="contained" onClick={() => openRemoveModal({ borrower: record })}>
                  Remove Borrower
                </Button>
              </TableActions>
            </div>
          ),
        },
      ]}
      rowKey={(record) => `${record.Address}_${record.borrowerIndex}`}
      dataSource={tableData}
    />
  );
}
