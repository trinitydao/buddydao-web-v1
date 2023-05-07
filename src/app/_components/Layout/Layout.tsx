'use client';
import { COLORS } from '@/styles/vars';
import { css } from '@emotion/css';
import classNames from 'classnames';
import Color from 'color';
import type { PropsWithChildren } from 'react';
import { HEAD_HEIGHT } from './constants';
import { Head } from './Head';

export function Layout({ children }: PropsWithChildren<{}>) {
  const leftBgColor = Color(COLORS.PRIMARY).fade(0.6).rgb().string();
  return (
    <>
      <Head />
      <div className={bgStyles.wrap} style={{ ...({ '--head-height': `${HEAD_HEIGHT}px` } as any) }}>
        <div className={bgStyles.left}>
          <div className={bgStyles.leftBg} style={{ ...({ '--color': leftBgColor } as any) }} />
        </div>
        <div className={bgStyles.center}></div>
        <div className={bgStyles.right}>
          <div className={bgStyles.rightBg} style={{ ...({ '--color': 'rgba(255, 0, 210, 0.15)' } as any) }} />
        </div>
      </div>
      <div className={styles.wrap} style={{ ...({ '--head-height': `${HEAD_HEIGHT + 32}px` } as any) }}>
        <div className={styles.content}>{children}</div>
      </div>
    </>
  );
}

const styles = {
  wrap: classNames('flex', 'justify-center', 'px-4', 'pt-[var(--head-height)]', 'pb-4', 'w-full'),
  content: classNames('w-full', 'max-w-[1200px]'),
};

const bgStyles = {
  wrap: classNames('fixed', 'flex', 'top-[var(--head-height)]', 'left-0', 'w-full', 'h-full', '-z-50'),
  left: classNames('relative', 'flex-1'),
  center: classNames('w-full', 'max-w-[1200px]'),
  right: classNames('relative', 'flex-1'),
  leftBg: classNames(
    'absolute',
    '-z-50',
    'top-[-50px]',
    'right-[-600px]',
    'h-[1000px]',
    'w-[1000px]',
    'rounded-full',
    css({
      background: `radial-gradient(closest-side circle, var(--color), rgba(255,255,255,0.1))`,
    }),
  ),
  rightBg: classNames(
    'absolute',
    '-z-50',
    'top-[-200px]',
    'left-[-600px]',
    'h-[1000px]',
    'w-[1000px]',
    'rounded-full',
    css({
      background: `radial-gradient(closest-side circle, var(--color), rgba(255,255,255,0.05))`,
    }),
  ),
};
