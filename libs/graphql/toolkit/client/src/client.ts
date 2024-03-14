import type { Client, ClientOptions } from '@urql/core';
import { cacheExchange, createClient, fetchExchange } from '@urql/core';

export const createGQLClient = (options: ClientOptions): Client => {
  return createClient({
    ...options,
    exchanges: [cacheExchange, fetchExchange],
  });
};
