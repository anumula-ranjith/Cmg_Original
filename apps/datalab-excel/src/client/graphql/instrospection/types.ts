export type Identifier = string;

export type CoerceFieldsIntoOperationOptions = Readonly<{
  readonly include?: readonly string[];
  readonly exclude?: readonly string[];
  readonly maxNested?: number;
}>;

export type ExcelRecord = Readonly<{
  id: Identifier;
  [key: string]: unknown;
}>;

export type GetListQuery<TResourceType extends string, RecordType extends ExcelRecord> = Record<
  TResourceType,
  Readonly<{
    items: RecordType[];
    totalCount: number;
    pageInfo: {
      hasNextPage?: boolean;
      hasPreviousPage?: boolean;
    };
  }>
>;

export type PaginationPayload = Readonly<{
  page: number;
  perPage: number;
}>;

export type SortPayload = Readonly<{
  field: string;
  order: string;
}>;

export type GetListParams = Readonly<{
  pagination: PaginationPayload;
  sort: SortPayload;
  filter: unknown;
  meta?: unknown;
}>;

export type GetListResult<TRecordType extends ExcelRecord> = Readonly<{
  data: TRecordType[];
  total?: number;
  pageInfo?: {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}>;
