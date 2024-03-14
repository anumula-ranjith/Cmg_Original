export type CoerceFieldsIntoOperationOptions = {
  /**
   * Dot delimited fields to include.
   */
  readonly include?: readonly string[];
  /**
   * Dot delimited fields to exclude.
   */
  readonly exclude?: readonly string[];
  /**
   * The maximum number of nested types.
   * Defaults to 3.
   */
  readonly maxNested?: number;

  /**
   * The maximum number of ciclycal nested depth.
   */
  readonly maxCyclicNested?: number;
};

export type CoerceOperationOptions = CoerceFieldsIntoOperationOptions & {
  readonly args?: Record<string, unknown>;
};

export type BuildOperation =
  | {
      readonly field: string;
      readonly options?: CoerceOperationOptions;
      readonly alias?: string;
    }
  | string;
