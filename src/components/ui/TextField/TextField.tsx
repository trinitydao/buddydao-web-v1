'use client';

import type { ReactNode, ChangeEventHandler, InputHTMLAttributes } from 'react';
import type { FieldProps } from '../Field';

import classNames from 'classnames';
import { useState } from 'react';
import { useUpdateEffect } from 'ahooks';
import Color from 'color';
import { COLORS } from '@/styles/vars';
import { Field } from '../Field';

export interface TextFieldProps
  extends Omit<FieldProps, 'children'>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  error?: string;
  addAfter?: ReactNode;
  onChange?: (value: string) => void;
}

export function TextField(props: TextFieldProps) {
  const {
    className,
    id: idProp,
    type: typeProp,
    footer,
    value: valueProp,
    defaultValue,
    placeholder,
    label,
    error,
    addAfter,
    onChange,
    ...restProps
  } = props;

  const type = typeProp ?? 'text';
  const fieldProps: FieldProps = { className, id: idProp, label, error, footer };

  const isControlled = 'value' in props;
  const [innerValue, setInnerValue] = useState<string | undefined>(defaultValue);

  useUpdateEffect(() => {
    if (!isControlled && valueProp !== innerValue) {
      setInnerValue(valueProp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueProp]);

  const value = isControlled ? valueProp : innerValue;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    if (!isControlled) {
      setInnerValue(value);
    }
    onChange?.(value);
  };

  const cssVars = {
    '--textfield-border-color': Color(COLORS.PRIMARY),
  };

  return (
    <Field {...fieldProps}>
      {({ id }) => (
        <span className={styles.inputWrap}>
          <input
            type={type}
            id={id}
            placeholder={placeholder}
            className={styles.input}
            style={{ ...({ ...cssVars } as any) }}
            value={value}
            onChange={handleChange}
            {...restProps}
          />
          {addAfter}
        </span>
      )}
    </Field>
  );
}

const styles = {
  inputWrap: classNames(
    'flex',
    'items-center',
    'w-full',
    'px-6',
    'h-[48px]',
    'text-base',
    'font-normal',
    'text-gray-700',
    'bg-[#F8F8F8]',
    'border',
    'border-solid',
    'border-[#F8F8F8]',
    'rounded',
    'transition',
    'ease-in-out',
    'm-0',
    'focus:text-gray-700',
    'focus:bg-white',
    'focus:border-[var(--textfield-border-color)]',
  ),
  input: classNames('flex-1', 'bg-transparent', 'focus:outline-none'),
};
