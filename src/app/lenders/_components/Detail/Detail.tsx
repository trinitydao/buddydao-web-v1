import type { PropsWithChildren } from 'react';
import classNames from 'classnames';

export function Detail({ children }: PropsWithChildren) {
  return <div className={styles.detail}>{children}</div>;
}

const styles = {
  detail: classNames('mt-', 'flex', 'flex-col', 'gap-[12px]'),
};
