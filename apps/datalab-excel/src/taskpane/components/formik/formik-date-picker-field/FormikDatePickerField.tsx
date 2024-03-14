import { DatePickerField, DatePickerFieldProps } from './DatePickerField';
import { useField, useFormikContext } from 'formik';
import React, { useCallback } from 'react';

import { formatDate, parseDate } from './FormikDatePickerField.model';

export type FormikDatePickerFieldProps<TFormValues extends Record<string, unknown>> = Omit<
  DatePickerFieldProps,
  'name' | 'value' | 'onChange' | 'error' | 'helperText'
> & {
  readonly name: keyof TFormValues & string;
};

// This is a ~copy of CMG design system formik date picker field.
// TODO - Replace usages after moving addin back to monorepo.
export function FormikDatePickerField<TFormValues extends Record<string, unknown>>({
  name,
  ...restProps
}: FormikDatePickerFieldProps<TFormValues>): JSX.Element {
  const [field, meta] = useField<string | undefined | null>(name);
  const { setFieldValue } = useFormikContext();

  const handleChange = useCallback(
    (date: unknown) => {
      if (date instanceof Date || date === null) {
        const value = formatDate(date);
        setFieldValue(name, value);
      }
    },
    [name, setFieldValue]
  );

  return (
    <DatePickerField
      {...restProps}
      {...field}
      value={parseDate(field.value)}
      onChange={handleChange}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
}
