import { DesignSystemProvider } from '@cmg/design-system';
import type { RenderOptions } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import * as yup from 'yup';

import { FormikDatePickerField } from './FormikDatePickerField';

describe('FormikDatePickerField', () => {
  type FormValues = { dateCreated: string };
  const testErrorMessage = 'Date Created is a required field';
  const testSchema = yup.object().shape({
    dateCreated: yup.string().label('Date Created').required(),
  });

  const createWrapper = (
    initialValues: FormValues = { dateCreated: '' }
  ): RenderOptions['wrapper'] => {
    return ({ children }) => (
      <DesignSystemProvider>
        <Formik<FormValues>
          initialValues={initialValues}
          onSubmit={jest.fn()}
          validationSchema={testSchema}
          validateOnChange={true}
        >
          {children}
        </Formik>
      </DesignSystemProvider>
    );
  };

  it('should render date picker', () => {
    const { getByRole } = render(<FormikDatePickerField name="dateCreated" />, {
      wrapper: createWrapper(),
    });

    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('should render date picker with default value', () => {
    const { getByRole } = render(<FormikDatePickerField name="dateCreated" />, {
      wrapper: createWrapper({ dateCreated: '2021-09-27' }),
    });

    expect(getByRole('textbox')).toHaveValue('09/27/2021');
  });

  it.each`
    value           | triggerBlur | shouldShowError | description
    ${'09/27/2021'} | ${false}    | ${false}        | ${'should not show error when text field is not touched and contains valid value'}
    ${''}           | ${false}    | ${false}        | ${'should not show error when text field is not touched and contains invalid value'}
    ${'09/27/2021'} | ${true}     | ${false}        | ${'should not show error when text field is touched and contains valid value'}
    ${''}           | ${true}     | ${true}         | ${'should show error when text field is touched and contains invalid value'}
  `(
    '$description',
    async ({
      value,
      triggerBlur,
      shouldShowError,
    }: {
      value: string;
      triggerBlur: boolean;
      shouldShowError: boolean;
    }) => {
      const { getByRole, queryByText } = render(<FormikDatePickerField name="dateCreated" />, {
        wrapper: createWrapper(),
      });

      const textbox = getByRole('textbox');
      fireEvent.change(textbox, { target: { value } });

      if (triggerBlur) {
        fireEvent.blur(textbox);
      }

      await waitFor(() => expect(textbox).not.toHaveFocus());

      if (shouldShowError) {
        expect(await screen.findByText(testErrorMessage)).toBeInTheDocument();
        expect(textbox).toBeInvalid();
      } else {
        expect(queryByText(testErrorMessage)).not.toBeInTheDocument();
        expect(textbox).not.toBeInvalid();
      }
    }
  );
});
