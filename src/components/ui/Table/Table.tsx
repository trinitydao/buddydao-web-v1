'use client';

import type { TableProps } from './types';
import { TEXT_COLORS } from '@/styles/vars';
import classNames from 'classnames';

export function Table<T = any>(props: TableProps<T>) {
  const { columns, dataSource, rowKey } = props;

  const hasData = !!dataSource?.length;

  function getRowKey(row: T, index: number) {
    if (typeof rowKey === 'function') {
      return rowKey(row, index);
    }
    return row[rowKey];
  }

  function renderHeader() {
    return (
      <thead className={styles.thead}>
        <tr>
          {columns.map((column) => {
            return (
              <th
                key={column.key}
                scope="col"
                className={classNames(styles.th)}
                style={{
                  ...(column.maxWidth ? ({ '--table-column-max-width': column.maxWidth } as any) : {}),
                }}
              >
                <div
                  className={classNames(styles.thWrap, {
                    [styles.thWrapMaxWidth]: column.maxWidth,
                  })}
                >
                  {column.title}
                </div>
              </th>
            );
          })}
        </tr>
      </thead>
    );
  }

  function renderBody() {
    return (
      <tbody>
        {dataSource?.map((row, rowIndex) => {
          const isEven = rowIndex % 2 === 0;

          const finalRowKey = getRowKey(row, rowIndex);
          if (typeof finalRowKey !== 'string') {
            throw new Error(`get row key error, key: ${finalRowKey}, index: ${rowIndex}`);
          }

          return (
            <tr
              key={finalRowKey}
              className={classNames(styles.bodyTr, {
                [styles.bodyTrEven]: isEven,
                [styles.bodyTrOdd]: !isEven,
              })}
            >
              {columns.map((column) => {
                const columnAlign = column.align || 'center';
                const columnJustifyContentClassName = getJustifyContentClassName(columnAlign);

                function renderContent() {
                  if (column.render) {
                    return column.render(row, rowIndex);
                  }

                  return row[column.dataKey as keyof T] as any;
                }

                const content = renderContent();

                return (
                  <td
                    key={column.key}
                    className={classNames(styles.bodyTd)}
                    style={{
                      ...(column.maxWidth ? ({ '--table-column-max-width': column.maxWidth } as any) : {}),
                      ...(column.minWidth ? ({ '--table-column-min-width': column.minWidth } as any) : {}),
                    }}
                  >
                    <div
                      className={classNames(styles.bodyTdWrap, columnJustifyContentClassName, {
                        [styles.bodyTdWrap_MaxWidth]: column.maxWidth,
                        [styles.bodyTdWrap_MinWidth]: column.minWidth,
                      })}
                    >
                      <div
                        className={classNames(styles.bodyTdContent, {
                          [styles.bodyTdWrap_MaxWidth]: column.maxWidth,
                        })}
                      >
                        {content}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  }

  function renderEmpty() {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className={styles.emptyTd}>
            <div className={styles.empty}>No Data</div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <div
      className={styles.table}
      style={{
        ...({
          '--table-text-color': TEXT_COLORS.SECONDARY,
        } as any),
      }}
    >
      <div className={styles.wrap1}>
        <div className={styles.wrap2}>
          <div className={styles.wrap3}>
            <table className={styles.innerTable}>
              {/* Table Header */}
              {renderHeader()}
              {/* Table Body */}
              {hasData && renderBody()}
              {!hasData && renderEmpty()}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  table: classNames('flex', 'flex-col', 'bg-white'),
  wrap1: classNames('overflow-x-auto'),
  wrap2: classNames('inline-flex', 'min-w-full'),
  wrap3: classNames('min-w-full', 'overflow-hidden'),
  innerTable: classNames('min-w-full'),
  thead: classNames(),
  th: classNames('text-base', 'font-normal', 'text-[var(--table-text-color)]'),
  thWrap: classNames('min-w-full', 'flex', 'items-center', 'justify-center', 'px-6', 'py-8'),
  thWrapMaxWidth: classNames('max-w-[var(--table-column-max-width)]'),
  bodyTr: classNames(),
  bodyTrEven: classNames('bg-[#F8F8F8]'),
  bodyTrOdd: classNames(),
  bodyTd: classNames('text-base', 'font-normal', 'text-[var(--table-text-color)]'),
  bodyTdWrap: classNames('flex', 'items-center', 'px-6', 'py-8'),
  bodyTdWrap_MaxWidth: classNames('max-w-[var(--table-column-max-width)]'),
  bodyTdWrap_MinWidth: classNames('min-w-[var(--table-column-min-width)]'),
  bodyTdContent: classNames('whitespace-nowrap', 'overflow-hidden', 'text-ellipsis'),

  emptyTd: classNames(),
  empty: classNames(
    'flex',
    'justify-center',
    'items-center',
    'w-full',
    'bg-[#FBFBFB]',
    'h-[180px]',
    'text-base',
    'font-normal',
    'text-gray-400',
  ),
};

function getJustifyContentClassName(columnAlign: 'left' | 'center' | 'right') {
  if (columnAlign === 'left') {
    return 'justify-start';
  }
  if (columnAlign === 'right') {
    return 'justify-end';
  }
  return 'justify-center';
}
