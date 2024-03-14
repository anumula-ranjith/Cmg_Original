import type { GraphQLSchema, IntrospectionQuery } from 'graphql';
import { buildClientSchema, getIntrospectionQuery } from 'graphql';
import type { FC } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { useAuth } from '../../../auth/useAuth';
import { appSettings } from '../../../config/appSettings';
import { fetchInstrospection } from '../client';
import type { GQLResponse } from '../types';

export type IntrospectionContextProps = {
  readonly schema: GraphQLSchema | null;
  readonly error: Error | null;
  readonly loading: boolean;
};

const defaultValues: IntrospectionContextProps = {
  schema: null,
  error: null,
  loading: true,
};

const IntrospectionContext = createContext<IntrospectionContextProps>(defaultValues);

const { graphqlUrl } = appSettings;

const INTROSPECTION_QUERY = getIntrospectionQuery({
  descriptions: true,
  schemaDescription: true,
});

export const IntrospectionProvider: FC = ({ children }) => {
  const { apiKey } = useAuth();
  const [schema, setSchema] = useState<GraphQLSchema | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (apiKey) {
      setLoading(true);
      fetchInstrospection(graphqlUrl, apiKey, INTROSPECTION_QUERY)
        .then((gqlResponse: GQLResponse) => {
          setSchema(buildClientSchema(gqlResponse.data as unknown as IntrospectionQuery));
          setError(null);
        })
        .catch(error => {
          error instanceof Error && setError(error);
          setSchema(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSchema(null);
      setError(null);
      setLoading(false);
    }
  }, [apiKey]);

  return (
    <IntrospectionContext.Provider value={{ loading, schema, error }}>
      {children}
    </IntrospectionContext.Provider>
  );
};

export const useSchema = () => useContext(IntrospectionContext);
