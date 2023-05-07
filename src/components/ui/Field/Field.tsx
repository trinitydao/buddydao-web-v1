'use client';

import type { ReactNode } from 'react';
import classNames from 'classnames';

export interface FieldProps {
  className?: string;
  id?: string;
  label?: ReactNode;
  footer?: ReactNode;
  error?: string;
  children?: ReactNode | ((args: { id: string }) => ReactNode);
}

let num = 1;

export function Field(props: FieldProps) {
  const { className, id: idProp, label, error, footer, children } = props;
  const id = idProp ?? `field-${num++}`;

  const cssVars = {
    '--field-label-text-color': 'rgba(153, 153, 153, 1)',
  };

  return (
    <div className={classNames(styles.container, className)} style={{ ...({ ...cssVars } as any) }}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      {typeof children === 'function' ? children({ id }) : children}
      <div className={styles.footer}>
        {error && <div className={styles.error}>{error}</div>}
        {footer}
      </div>
    </div>
  );
}

const styles = {
  container: classNames('flex', 'flex-col', 'items-start'),
  label: classNames('pl-[8px]', 'pb-[6px]', 'text-sm', 'text-[var(--field-label-text-color)]'),
  footer: classNames('mt-[2px]', 'pl-[8px]', 'min-h-[26px]', 'text-[13px]', 'text-[#999999]'),
  error: classNames('text-[#ff4d4f]'),
};
