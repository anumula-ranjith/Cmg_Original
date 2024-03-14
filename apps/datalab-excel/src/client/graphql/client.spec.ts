import type { GraphQLSchema } from 'graphql';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { fetchGraphqlData, fetchInstrospection } from './client';
import type { BuildQueryOptions } from './instrospection/build';

enableFetchMocks();

jest.mock('./instrospection/build', () => ({
  buildQuery: jest.fn(),
}));

const graphqlUrlMock = 'http://cmg.com/graphql';
const apiKeyMock = 'someApiKey';
const queryMock = '{ someQuery }';
const jsonHeaderMock = { headers: { 'Content-Type': 'application/graphql-response+json' } };

describe('fetchInstrospection', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should call fetch and return the result', async () => {
    const mockResponse = { data: {} };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), jsonHeaderMock);
    const result = await fetchInstrospection(graphqlUrlMock, apiKeyMock, queryMock);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      graphqlUrlMock,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKeyMock}`,
        },
        body: JSON.stringify({
          query: queryMock,
          variables: null,
        }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error when no API key is set', async () => {
    await expect(fetchInstrospection(graphqlUrlMock, null, '{ someQuery }')).rejects.toThrow(
      'No API Key set'
    );
  });

  it('should throw an error when the server responds with a non-200 status', async () => {
    fetchMock.mockResponseOnce('', { status: 404, ...jsonHeaderMock });
    await expect(
      fetchInstrospection(graphqlUrlMock, 'someApiKey', '{ someQuery }')
    ).rejects.toThrow('Server responded with 404 Not Found');
  });

  it('should throw an error when the content type is not application/graphql-response+json', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { headers: { 'Content-Type': 'text/plain' } });
    await expect(
      fetchInstrospection('http://example-miguel.com/graphql', 'someApiKey', '{ someQuery }')
    ).rejects.toThrow('Expected JSON response but received text/plain');
  });

  it('should throw an error when the GraphQL response contains errors', async () => {
    const mockResponse = { errors: [{ message: 'Some error' }] };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), jsonHeaderMock);
    await expect(
      fetchInstrospection('http://example.com/graphql', 'someApiKey', '{ someQuery }')
    ).rejects.toThrow('Errors: Some error');
  });
});

describe('fetchGraphqlData', () => {
  const sourceMock = 'offerings';
  const queryOptionsMock: BuildQueryOptions = {
    query: {
      take: 10,
    },
  };
  const schemaMock = {} as GraphQLSchema;

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should call fetch and return the result', async () => {
    const mockResponse = { data: { someSource: {} } };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), jsonHeaderMock);
    const whereClause = 'someWhereClause';
    const result = await fetchGraphqlData(
      schemaMock,
      graphqlUrlMock,
      apiKeyMock,
      sourceMock,
      queryOptionsMock,
      whereClause
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      graphqlUrlMock,
      expect.objectContaining({
        body: '{}',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKeyMock}`,
        },
      })
    );
    expect(result).toEqual(mockResponse.data[sourceMock]);
  });

  it('should throw an error when no API key is found', async () => {
    await expect(
      fetchGraphqlData(
        schemaMock,
        'http://example.com/graphql',
        null,
        'someSource',
        queryOptionsMock,
        'someWhereClause'
      )
    ).rejects.toThrow('No API key found');
  });

  it('should throw an error when the server responds with a non-200 status', async () => {
    fetchMock.mockResponseOnce('{}', { status: 404, ...jsonHeaderMock });
    await expect(
      fetchGraphqlData(
        schemaMock,
        'http://example.com/graphql',
        'someApiKey',
        'someSource',
        queryOptionsMock,
        'someWhereClause'
      )
    ).rejects.toThrow('Server responded with 404 Not Found');
  });

  it('should throw an error when the GraphQL response contains errors', async () => {
    const mockResponse = { errors: [{ message: 'Some error' }] };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), jsonHeaderMock);
    await expect(
      fetchGraphqlData(
        schemaMock,
        'http://example.com/graphql',
        'someApiKey',
        'someSource',
        queryOptionsMock,
        'someWhereClause'
      )
    ).rejects.toThrow('GraphQL: Some error');
  });
});
