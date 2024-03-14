export type IQueryPath = Readonly<{
  [key: string]: string | IQueryPath;
}>;

export type GQLScalar = string | number | boolean | null;

export type GQLEnum = Record<string, GQLScalar>;

export type GQLNode = Readonly<{
  [key: string]: GQLScalar | GQLScalar[] | GQLNode | GQLNode[] | GQLEnum;
}>;

export type GQLPageInfo = Readonly<{
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}>;

export type GQLQueryType = Readonly<{
  pageInfo?: GQLPageInfo;
  totalCount?: number;
  items: GQLNode[];
}>;

export type GQLResponse = Readonly<{
  data?: Record<string, GQLQueryType | GQLSchema | GQLSchemaForTypeQuery> | GQLSchemaKind;
  errors?: GQLError[];
}>;

export type GQLLocation = Readonly<{
  line: number;
  column: number;
}>;

export type GQLErrorExtensions = Readonly<{
  type: string;
  field: string;
  responseName: string;
  specifiedBy: string;
}>;

export type GQLError = Readonly<{
  message: string;
  locations: GQLLocation[];
  extensions: GQLErrorExtensions;
}>;

export type GQLTypeRef = Readonly<{
  kind: string;
  name?: string;
  ofType?: GQLTypeRef;
  fields?: GQLField[];
}>;

export type GQLField = Readonly<{
  name: string;
  type: GQLTypeRef;
  description: string;
}>;

export type GQLType = Readonly<{
  kind: string;
  name: string;
  description?: string;
  fields?: GQLField[];
  interfaces?: GQLTypeRef[];
  possibleTypes?: GQLTypeRef[];
  enumValues?: { name: string; description?: string }[];
  inputFields?: GQLField[];
}>;

export type GQLSchema = Readonly<{
  queryType: GQLTypeRef;
  mutationType?: GQLTypeRef;
  subscriptionType?: GQLTypeRef;
  types: GQLType[];
  directives: {
    name: string;
    description?: string;
    locations: string[];
    args: GQLField[];
  }[];
}>;

export type GQLSchemaForTypeQuery = Readonly<{
  __type: {
    name: string;
    fields?: GQLField[];
  };
}>;

export type GQLSchemaKind = Readonly<{
  __schema: {
    name: string;
    kind: string;
    queryType: { fields: GQLField[] };
  };
}>;
