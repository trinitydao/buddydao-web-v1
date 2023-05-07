'use client';

import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import { Children } from 'react';
export interface TableActionsProps extends PropsWithChildren {}

export const TableActions: FC<TableActionsProps> = (props) => {
  const { children } = props;

  return (
    <div className={styles.tableActions}>
      {Children.map(children, (child) => {
        return <div>{child}</div>;
      })}
    </div>
  );
};

const styles = {
  tableActions: classNames('flex', 'gap-4'),
};
