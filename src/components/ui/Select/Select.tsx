'use client';

import { COLORS } from '@/styles/vars';
import { Listbox, Transition } from '@headlessui/react';
import { useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import Color from 'color';
import Image from 'next/image';
import { Fragment, useState } from 'react';

import arrowPng from './arrow.png';

export interface SelectProps<T> {
  id?: string;
  options: { label: string; value: T }[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

export function Select<T>(props: SelectProps<T>) {
  const { id, value: valueProp, defaultValue, options, onChange } = props;

  const isControlled = 'value' in props;
  const [innerValue, setInnerValue] = useState<T | undefined>(valueProp ?? defaultValue);

  useUpdateEffect(() => {
    if (!isControlled && valueProp !== innerValue) {
      setInnerValue(valueProp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueProp]);

  const value = isControlled ? valueProp : innerValue;

  const selected = options.find((option) => option.value === value);

  function handleChange(value: T) {
    if (!isControlled) {
      setInnerValue(value);
    }
    onChange?.(value);
  }

  const cssVars = {
    '--select-border-color': Color(COLORS.PRIMARY),
  };

  return (
    <Listbox name={id} value={value} onChange={handleChange}>
      <div className={styles.wrap} style={{ ...(cssVars as any) }}>
        <Listbox.Button
          className={({ open }) =>
            classNames(styles.button, {
              [styles.buttonClose]: !open,
              [styles.buttonOpen]: open,
            })
          }
        >
          <span className={styles.buttonLabel}>{selected?.label}</span>
          <span className={styles.buttonIconWrap}>
            <Image src={arrowPng} width={19} height={11} aria-hidden="true" alt="" />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className={styles.options}>
            {options.map((option, optionIdx) => (
              <Listbox.Option
                key={optionIdx}
                className={({ active, selected }) => {
                  return classNames(styles.option, {
                    [styles.optionUnactived]: !active,
                    [styles.optionActived]: active,
                    [styles.optionSelected]: selected,
                  });
                }}
                value={option.value}
              >
                <span className={styles.optionLabel}>{option.label}</span>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

const styles = {
  wrap: classNames('relative', 'w-full'),
  button: classNames(
    'h-[48px]',
    'relative',
    'w-full',
    'cursor-pointer',
    'font-normal',
    'text-gray-700',
    'border',
    'border-solid',
    'rounded',
    'px-6',
    'text-left',
    'transition',
    'ease-in-out',
    'focus:outline-none',
    'focus:bg-white',
    'focus:border-[var(--select-border-color)]',
  ),
  buttonClose: classNames('bg-[#F8F8F8]', 'border-[#F8F8F8]'),
  buttonOpen: classNames('bg-white', 'border-[var(--select-border-color)]', 'outline-none'),
  buttonLabel: classNames('block truncate'),
  buttonIconWrap: classNames(
    'absolute',
    'inset-y-0',
    'right-0',
    'flex',
    'items-center',
    'pr-[15px]',
    'pointer-events-none',
  ),
  // options
  options: classNames(
    'absolute',
    'z-10',
    'mt-1',
    'w-full',
    'bg-white',
    'shadow-lg',
    'max-h-[300px]',
    'rounded',
    'py-1',
    'text-base',
    'font-normal',
    'text-[#333333]',
    'ring-1',
    'ring-black',
    'ring-opacity-5',
    'overflow-auto',
    'focus:outline-none',
  ),
  option: classNames('h-[44px]', 'relative', 'cursor-pointer', 'select-none', 'py-2', 'px-6'),
  optionUnactived: classNames(),
  optionActived: classNames('bg-[#F8F8F8]'),
  optionSelected: classNames('bg-[#CDF7ED]'),
  // option label
  optionLabel: classNames('block', 'truncate'),
};
