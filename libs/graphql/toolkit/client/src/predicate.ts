import type { AnyVariables, OperationResult } from '@urql/core';

import type { OperationResultWithData } from './types';

export const isResultWithData = <Data = unknown, Variables extends AnyVariables = AnyVariables>(
  result: OperationResult<Data, Variables>
): result is OperationResultWithData<Data, Variables> =>
  typeof (result as OperationResultWithData<Data, Variables>).data !== 'undefined';

export const assertResultWithData = <Data = unknown, Variables extends AnyVariables = AnyVariables>(
  result: OperationResult<Data, Variables>
): OperationResultWithData<Data, Variables> => {
  if (isResultWithData(result)) {
    return result;
  }

  throw new Error('The operation data is null or empty.');
};

export const assertResultWithoutError = <
  Data = unknown,
  Variables extends AnyVariables = AnyVariables
>(
  result: OperationResult<Data, Variables>
): OperationResult<Data, Variables> => {
  if (result.error == null) {
    return result;
  }

  throw result.error;
};
