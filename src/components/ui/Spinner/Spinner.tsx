'use client';

import styles from './Spinner.module.scss';

export interface SpinnerProps {
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

export function Spinner(props: SpinnerProps) {
  const { color = '#999999', size: sizeProp = 'medium' } = props;

  const { size, borderSize } = {
    small: { size: 16, borderSize: 2 },
    medium: { size: 24, borderSize: 4 },
    large: { size: 32, borderSize: 6 },
  }[sizeProp];

  return (
    <div
      className={styles['spinner']}
      style={{
        ...({
          '--spinner-size': `${size}px`,
          '--spinner-border-size': `${borderSize}px`,
          '--spinner-color': color,
        } as any),
      }}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
