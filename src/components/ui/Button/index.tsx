'use client';

import type { FC, HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';
import { COLORS } from '@/styles/vars';
import { css } from '@emotion/css';
import Color from 'color';

export type ButtonVariant = 'text' | 'contained' | 'outlined';
export type ButtonSize = 'small' | 'medium' | 'medium-1' | 'large';

export interface ButtonProps extends PropsWithChildren<{}> {
  variant?: ButtonVariant;
  color?: string;
  size?: ButtonSize;
  shape?: 'square' | 'round';
  block?: boolean;
  disabled?: boolean;
  onClick?: HTMLAttributes<HTMLButtonElement>['onClick'];
  className?: string;
}

export const Button: FC<ButtonProps> = (props) => {
  const { variant = 'text', size = 'medium', shape = 'round', disabled, block, onClick, children, className } = props;

  const primaryColor = COLORS.PRIMARY;

  const lightColor_1 = Color(primaryColor).fade(0.95).rgb().string();
  const lightColor_2 = Color(primaryColor).fade(0.8).rgb().string();
  const darkenColor_1 = Color(primaryColor).darken(0.1).rgb().string();
  const darkenColor_2 = Color(primaryColor).darken(0.3).rgb().string();

  // ------------ variant ------------
  const variantCssVars = getVariantCssVars();
  function getVariantCssVars() {
    return {
      text: {
        '--button-text-color': primaryColor,
        '--button-bg': COLORS.WHITE,
        '--button-hover-bg': lightColor_1,
        '--button-active-bg': lightColor_2,
      },
      contained: {
        '--button-text-color': COLORS.WHITE,
        '--button-bg': COLORS.PRIMARY,
        '--button-hover-bg': darkenColor_1,
        '--button-active-bg': darkenColor_2,
        ...(disabled
          ? {
              '--button-text-color': '#666',
              '--button-bg': '#eee',
              '--button-hover-bg': '#eee',
              '--button-active-bg': '#eee',
            }
          : {}),
      },
      outlined: {
        '--buttton-border-width': '1px',
        '--buttton-border-color': primaryColor,
        '--button-bg': COLORS.WHITE,
        '--button-text-color': primaryColor,
        '--button-hover-bg': lightColor_1,
        '--button-active-bg': lightColor_2,
      },
    }[variant];
  }

  // ------------ size ------------
  const sizeCssVars = getSizeCssVars();
  function getSizeCssVars() {
    return {
      small: {
        '--button-height': '36px',
        '--button-padding-x': '18px',
      },
      medium: {
        '--button-height': '44px',
        '--button-padding-x': '24px',
      },
      'medium-1': {
        '--button-height': '48px',
        '--button-padding-x': '24px',
      },
      large: {
        '--button-height': '66px',
        '--button-padding-x': '30px',
      },
    }[size];
  }

  // ------------ shape ------------
  const shapeCssVars = getShapeCssVars();
  function getShapeCssVars() {
    return {
      square: {
        '--button-border-radius': {
          small: '4px',
          medium: '8px',
          'medium-1': '10px',
          large: '12px',
        }[size],
      },
      round: {
        '--button-border-radius': '9999px',
      },
    }[shape];
  }

  return (
    <button
      type="button"
      style={{
        ...({ ...variantCssVars, ...sizeCssVars, ...shapeCssVars } as any),
      }}
      className={classNames(
        styles.button,
        {
          [styles.block]: block,
        },
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const styles = {
  button: classNames(
    'inline-flex',
    'justify-center',
    'items-center',
    'box-border',
    'rounded-[var(--button-border-radius)]',
    'h-[var(--button-height)]',
    'border-[var(--buttton-border-color)]',
    'bg-[var(--button-bg)]',
    'text-[var(--button-text-color)]',
    'px-[var(--button-padding-x)]',
    'text-sm',
    'font-medium',
    'transition',
    'duration-150',
    'ease-in-out',
    'hover:bg-[var(--button-bg)]',
    'focus:outline-none',
    'hover:bg-[var(--button-hover-bg)]',
    'hover:opacity-[var(--button-hover-opacity)]',
    'active:bg-[var(--button-active-bg)]',
    'hover:shadow-sm',
    css({
      borderWidth: 'var(--buttton-border-width, 0)',
    }),
  ),
  block: classNames('flex', 'w-full'),
};
