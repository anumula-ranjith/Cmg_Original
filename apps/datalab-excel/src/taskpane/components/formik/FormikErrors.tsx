import { Alert } from '@mui/material';
import { useFormikContext } from 'formik';

const FormikErrors: React.FC = () => {
  const { errors, touched } = useFormikContext();
  const errorsKeys = Object.keys(errors);
  const keys = Object.keys(touched);

  return (
    <div>
      {keys.length > 0 && errorsKeys.length > 0 && (
        <Alert severity="error">
          <strong>An entry is required or has an invalid value for the following fields:</strong>
          <ul>
            {errorsKeys.map(key => (
              <li key={key}>- {errors[key]}</li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );
};

export default FormikErrors;
