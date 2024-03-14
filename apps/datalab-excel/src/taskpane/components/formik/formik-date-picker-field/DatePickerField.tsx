import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import { DatePicker as MUIDatePickerField } from '@mui/x-date-pickers/DatePicker';
import React from 'react';

export type DatePickerFieldProps = Readonly<{
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly required?: boolean;
  readonly error?: boolean;
  readonly helperText?: React.ReactNode;
  readonly name?: string;
  readonly label?: React.ReactNode;
  readonly size?: 'small' | 'medium';
  readonly value: Date | null;
  readonly onChange: (value: Date | null, keyboardInputValue?: string) => void;
  readonly onBlur?: TextFieldProps['onBlur'];
}>;

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  name,
  label,
  required,
  error,
  helperText,
  size,
  onBlur,
  ...props
}) => {
  return (
    <MUIDatePickerField
      {...props}
      renderInput={params => (
        <TextField
          {...params}
          name={name}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          size={size}
          onBlur={onBlur}
        />
      )}
    />
  );
};
