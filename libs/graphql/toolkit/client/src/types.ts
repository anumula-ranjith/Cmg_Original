import type { AnyVariables, OperationResult } from '@urql/core';

export type OperationResultWithData<
  Data = unknown,
  Variables extends AnyVariables = AnyVariables
> = OperationResult<Data, Variables> & Required<Pick<OperationResult<Data, Variables>, 'data'>>;
