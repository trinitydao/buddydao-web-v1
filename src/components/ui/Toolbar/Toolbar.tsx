'use client';

import classNames from 'classnames';
import { PropsWithChildren } from 'react';

export interface ToolbarProps extends PropsWithChildren {}

export function Toolbar(props: ToolbarProps) {
  const { children } = props;
  return (
    <div className={styles.toolbar}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

const styles = {
  toolbar: classNames('mb-4'),
  content: classNames('flex', 'gap-4', 'min-h-[66px]'),
};
