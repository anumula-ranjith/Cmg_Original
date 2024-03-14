import '@testing-library/jest-dom/extend-expect';

import { render, screen, waitFor } from '@testing-library/react';
import * as GraphQLModule from 'graphql';

import * as AuthModule from '../../../auth/useAuth';
import * as ClientModule from '../client';
import type { GQLResponse } from '../types';
import { IntrospectionProvider, useSchema } from './useSchema';

jest.mock('../client', () => ({
  fetchInstrospection: jest.fn(),
}));

jest.mock('graphql', () => ({
  buildClientSchema: jest.fn(),
  getIntrospectionQuery: jest.fn(),
}));

jest.mock('../../../auth/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockGQLResponse: GQLResponse = {
  data: {
    __schema: {
      queryType: { fields: [] },
      name: 'MockSchema',
      kind: 'OBJECT',
    },
  },
};

describe('IntrospectionProvider', () => {
  let fetchInstrospectionSpy: jest.SpyInstance<
    Promise<GQLResponse>,
    Parameters<typeof ClientModule.fetchInstrospection>
  >;
  let buildClientSchemaSpy: jest.SpyInstance<ReturnType<typeof GraphQLModule.buildClientSchema>>;
  let useAuthSpy: jest.SpyInstance<ReturnType<typeof AuthModule.useAuth>>;

  beforeEach(() => {
    fetchInstrospectionSpy = jest.spyOn(ClientModule, 'fetchInstrospection');
    buildClientSchemaSpy = jest.spyOn(GraphQLModule, 'buildClientSchema');
    useAuthSpy = jest.spyOn(AuthModule, 'useAuth');

    fetchInstrospectionSpy.mockResolvedValue(mockGQLResponse);
    buildClientSchemaSpy.mockReturnValue({
      description: 'Test Schema',
    } as GraphQLModule.GraphQLSchema);
    useAuthSpy.mockReturnValue({
      apiKey: 'someApiKey',
      saveApiKey: jest.fn(),
      resetAuth: jest.fn(),
    });
  });

  it('should render error state correctly', async () => {
    fetchInstrospectionSpy.mockRejectedValue(new Error('An error has ocurred'));
    const TestComponent = () => {
      const { error } = useSchema();
      return <div>{error ? error.message : 'Unexpected'}</div>;
    };
    render(
      <IntrospectionProvider>
        <TestComponent />
      </IntrospectionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('An error has ocurred')).toBeInTheDocument();
    });
  });

  it('should render no API key state correctly', async () => {
    useAuthSpy.mockReturnValue({
      apiKey: null,
      saveApiKey: jest.fn(),
      resetAuth: jest.fn(),
    });
    const TestComponent = () => {
      const { schema, error } = useSchema();
      return (
        <div>
          <div>{schema === null ? 'Null Eschema' : 'Unexpected'}</div>
          <div>{error === null ? 'Null Error' : 'Unexpected'}</div>
        </div>
      );
    };
    render(
      <IntrospectionProvider>
        <TestComponent />
      </IntrospectionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Null Eschema')).toBeInTheDocument();
      expect(screen.getByText('Null Error')).toBeInTheDocument();
    });
  });

  it('should return the schema from graphql build client schema', async () => {
    const TestComponent = () => {
      const { schema, error } = useSchema();
      return (
        <div>
          <div>{schema ? schema.description : 'Unexpected'}</div>
          <div>{error === null ? 'Null Error' : 'Unexpected'}</div>
        </div>
      );
    };
    render(
      <IntrospectionProvider>
        <TestComponent />
      </IntrospectionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Schema')).toBeInTheDocument();
      expect(screen.getByText('Null Error')).toBeInTheDocument();
    });
  });
});
