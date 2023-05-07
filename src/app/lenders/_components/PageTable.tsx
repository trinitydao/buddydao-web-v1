'use client';
import { AliasTableColumn } from '@/components/alias/AliasTableColumn';
import { Token } from '@/components/contract/Token';
import { TokenValue } from '@/components/contract/TokenValue';
import { Button } from '@/components/ui/Button';
import { Table, TableActions } from '@/components/ui/Table';
import { useLenders } from '@/services/contracts/buddyDao/lenders/getLenders';
import { utils } from 'ethers';
import { useBorrowModalStore } from './BorrowModal';
import { useRepaymentModalStore } from './RepaymentModal';

export function PageTable() {
  const { open: openBorrow } = useBorrowModalStore();
  const { open: openRepayment } = useRepaymentModalStore();

  const { data } = useLenders();

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
          render: (record) => <AliasTableColumn alias={record.Alias} address={record.Creditors} />,
        },
        { title: 'Token', key: 'token', render: (record) => <Token address={record.Token} /> },
        {
          title: 'Credit amount',
          key: 'trustAmount',
          render: (record) => {
            return <TokenValue address={record.Token} value={record.CreditLine} />;
          },
        },
        {
          title: 'Available',
          key: 'available',
          render: (record) => {
            const available = record.CreditLine.sub(record.Amount);
            return <TokenValue address={record.Token} value={available} />;
          },
        },
        {
          title: 'Interest Rate',
          key: 'fixedRate',
          render: (record) => {
            return <>{utils.formatUnits(record.FixedRate, 16)}%</>;
          },
        },
        {
          key: 'actions',
          render: (record) => (
            <div>
              <TableActions>
                <Button
                  variant="contained"
                  onClick={() => {
                    openBorrow({ lender: record });
                  }}
                >
                  Borrow
                </Button>
                <Button variant="outlined" onClick={() => openRepayment({ lender: record })}>
                  Repayment
                </Button>
              </TableActions>
            </div>
          ),
        },
      ]}
      rowKey={(row) => [row.Creditors, row.borrowerIndex].join('_')}
      dataSource={tableData}
    />
  );
}
