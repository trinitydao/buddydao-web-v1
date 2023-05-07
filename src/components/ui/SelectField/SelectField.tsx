'use client';

import type { FieldProps } from '../Field';
import type { SelectProps } from '../Select';
import { Field } from '../Field';
import { Select } from '../Select';

export interface SelectFieldProps<T> extends Omit<FieldProps, 'children'>, SelectProps<T> {}

export const SelectField = <T,>(props: SelectFieldProps<T>) => {
  const { className, id: idProp, label, error, footer, ...resetProps } = props;

  const fieldProps = { className, id: idProp, label, error, footer };

  return <Field {...fieldProps}>{({ id }) => <Select id={id} {...resetProps} />}</Field>;
};
