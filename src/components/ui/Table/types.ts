import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  title?: ReactNode;
  dataKey?: keyof T;
  render?: (record: T, index: number) => ReactNode;
  maxWidth?: string;
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: Column<T>[];
  dataSource?: readonly T[];
  rowKey: keyof T | ((record: T, index: number) => string);
}
