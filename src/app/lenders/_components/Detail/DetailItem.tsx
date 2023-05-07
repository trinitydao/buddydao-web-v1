'use client';
import type { ReactNode } from 'react';
import classNames from 'classnames';

export interface DetailItemProps {
  label: ReactNode;
  value: ReactNode;
}
export function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className={styles.detailItem}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
}

const styles = {
  detailItem: classNames('w-full', 'flex', 'justify-between', 'items-center'),
  label: classNames('text-sm', 'text-[#666666]'),
  value: classNames('text-sm', 'text-[#333333]'),
};
