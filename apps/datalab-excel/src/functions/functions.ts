import { singular } from 'pluralize';

import type { GQLNode, GQLResponse } from '../client/graphql/types';
import { appSettings } from '../config/appSettings';
import { toCamelCase } from '../utilities/stringutils';
import { Formatter } from './formatter';

// Local in memory cache for GraphQL results
type ICacheItem = {
  value: string;
  cachedAt: Date;
};
type ICache = Record<string, ICacheItem>;

const GraphQLCache: ICache = {};

// Wait for Office to be ready before trying to initialize
global.Office.onReady(() => {
  // CustomFunctions.associate('GET_ARRAY_VALUE', GET_ARRAY_VALUE);
  // CustomFunctions.associate('GET_ARRAY_LENGTH', GET_ARRAY_LENGTH);
  // CustomFunctions.associate('GET_FIELD_BY_NAME', GET_FIELD_BY_NAME);
  // CustomFunctions.associate('GET_MAPPED_VALUE_BY_ID', GET_MAPPED_VALUE_BY_ID);
  // CustomFunctions.associate('GET_MAPPED_VALUE_FROM_ARRAY', GET_MAPPED_VALUE_FROM_ARRAY);
  // CustomFunctions.associate(
  //   'GET_LIST_FROM_ARRAY_WITH_DELIMITER',
  //   GET_LIST_FROM_ARRAY_WITH_DELIMITER
  // );
  // CustomFunctions.associate('FORMAT_TEMPLATE', FORMAT_TEMPLATE);
}).catch(error => {
  console.error('Error registering custom functions', error);
});

// TODO: Need to update this function to use the suggested approach
// at https://learn.microsoft.com/en-us/office/dev/add-ins/excel/custom-functions-batching
// The calls to the function, should group by graphql type and then by field name
// combining the ids into a single where clause using the IN operator
// along with selecting all the fields that are needed dynamically
// the make the calls every 60 seconds or so to refresh the cache
// we should also check the cache before making the call

/**
 * Retrieves a specified field value by ID from the GraphQL server.
 * @customfunction
 * @param {string} id ID of the GraphQL type.
 * @param {string} fieldName Name of the field to get the value of.
 * @param {string} graphQlType GraphQL type name.
 * @param {string} conditions Name of the field to get the value of.
 * @returns {Promise<string>} The field value.
 */
async function GET_FIELD_BY_NAME(
  id: string,
  graphQlType: string,
  fieldName: string,
  conditions = ''
): Promise<string> {
  const endpoint = appSettings.graphqlUrl;

  if (!id) {
    throw new Error('ID is required');
  }

  if (!graphQlType) {
    throw new Error('TypeName is required');
  }

  if (!fieldName) {
    throw new Error('Field name is required');
  }

  const typeName = singular(toCamelCase(graphQlType));

  if (conditions) {
    // figure out a model for conditions
  }

  // check the cache first
  const cacheKey = `${id}-${typeName}-${fieldName}`;
  if (cacheKey in GraphQLCache) {
    // check the cachedAt time
    const cachedAt = GraphQLCache[cacheKey].cachedAt;
    const now = new Date();
    const diffSeconds = (now.getTime() - cachedAt.getTime()) / 1000;
    if (diffSeconds < 60) {
      return GraphQLCache[cacheKey].value;
    } else {
      // clear the cache item
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete GraphQLCache[cacheKey]; // <-- using dynamic keys, need to remove them
    }
  }

  // Get the API key from local storage
  // const apiKey = await OfficeRuntime.storage.getItem('apiKey');
  const apiKey = localStorage.getItem('apiKey');
  if (!apiKey) {
    throw new Error('API Key is required');
  }

  const field = toCamelCase(fieldName);

  const query = `query M${typeName}ById($id: ID!) {
    ${typeName}ById(id: $id) {
      ${field}
    }
  }
`;

  const variables = {
    id: id,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  };

  try {
    const response = await fetch(endpoint, options);
    const result = (await response.json()) as GQLResponse;
    // Should check for errors here
    if (result.errors) {
      throw new Error(`GraphQL error: ${result.errors[0].message}`);
    }
    if (!result.data) {
      throw new Error('No data returned');
    }

    const data = result.data[typeName + 'ById'] as GQLNode;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!data) {
      throw new Error(`No ${typeName} found with id ${id}`);
    }

    const fieldValue = data[fieldName];

    if (!fieldValue) {
      throw new Error(`Field "${fieldName}" not found`);
    }

    // cache the result
    GraphQLCache[cacheKey] = {
      value: fieldValue as string,
      cachedAt: new Date(),
    };

    return fieldValue as string;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
 * Returns the value at the provided position in a json array.
 * @customfunction
 * @param {string} value Json Array value.
 * @param {number} position Position of the value to return.
 * @returns {Promise<string>} The field value at the sepcified array position.
 */
function GET_ARRAY_VALUE(value: string, position: number): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const array = JSON.parse(value) as string[];
      resolve(array[position] ?? '');
    } catch (error) {
      return resolve('');
    }
  });
}

/**
 * Returns the length of a provided json array.
 * @customfunction
 * @param {string} value Json array value.
 * @returns {Promise<number>} The length of the array as a number.
 */
function GET_ARRAY_LENGTH(value: string): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      const array = JSON.parse(value) as string[];
      resolve(array.length);
    } catch (error) {
      return resolve(0);
    }
  });
}

/**
 * Returns the length of a provided json array.
 * @customfunction
 * @param {string} template Javascript template string.
 * @param {string[]} values Array of values to use in the template.
 * @returns {Promise<string | CustomFunctions.Error>} Formated string based on the template and values.
 */
function FORMAT_TEMPLATE(
  template: string,
  ...values: string[][]
): Promise<string | CustomFunctions.Error> {
  // return _pushOperation('format_template', template, values[0] as []);
  // logger.log('FORMAT_TEMPLATE');
  return new Promise((resolve, reject) => {
    resolve(format_template(template, values[0] as []));
  });
}

function format_template(template: string, values: string[]): string | CustomFunctions.Error {
  const formatter = new Formatter();
  try {
    const deserializedInput = values.map(item => parseWithFallback(item));
    // logger.log('Deserialized input:', deserializedInput);
    const result = formatter.format(template, deserializedInput);
    return result;
  } catch (err) {
    // logger.error('Error:', err);
    return new CustomFunctions.Error(
      CustomFunctions.ErrorCode.invalidReference,
      typeof err === 'string' ? err : (err as Error).message
    );
  }
}

// Returns everything as strings for use in the template formatter,
// We need to check the performance of this
function parseWithFallback(value: unknown): string | string[] {
  try {
    const parsed = JSON.parse(value as string, (key, value) => {
      let result: string | string[];
      if (Array.isArray(value)) {
        result = value.map(item =>
          Array.isArray(item) ? item.map(String) : String(item)
        ) as string[];
      } else {
        result = String(value);
      }
      return result;
    }) as unknown;
    if (Array.isArray(parsed)) {
      return parsed as string[];
    } else {
      return value as string;
    }
  } catch (e) {
    if (typeof value === 'string') {
      return value;
    } else {
      return '';
    }
  }
}

/**
 * Returns a CSV style list given a json string array.
 * @customfunction
 * @param {string} value Json array value.
 * @param {string} delimiter Delimiter to use on the output e.g. ',',  '|' etc.
 * @param {boolean} quote Should quote the output?
 * @returns {string} The CSV style list.
 */
function GET_LIST_FROM_ARRAY_WITH_DELIMITER(
  value: string,
  delimiter: string,
  quote = false
): string {
  const array = JSON.parse(value) as string[];
  if (quote) {
    return array.map(item => `"${item}"`).join(delimiter);
  } else {
    return array.join(delimiter);
  }
}

/**
 * Gets a specified field value by ID and maps it with the given Excel table. This handles the use case where the response from the graphql server is an array.
 * @customfunction
 * @param {string} id ID of the GraphQL type.
 * @param {string} fieldName Name of the field to get the value of.
 * @param {string} graphQlType GraphQL type name.
 * @param {string} tableName Excel range to map the value from.
 * @param {string} conditions Query conditions. Not implemented yet.
 * @returns {Promise<string>} The field value of the offering.
 */
async function GET_MAPPED_VALUE_BY_ID(
  id: string,
  fieldName: string,
  graphQlType: string,
  tableName: string,
  conditions = ''
): Promise<string> {
  const value = await GET_FIELD_BY_NAME(id, graphQlType, fieldName, conditions);
  if (!tableName || tableName === '') {
    return value;
  }

  // determine is the value returned is an array
  let isArray = value.startsWith('[');
  let arraySource: string[] = [];
  if (isArray) {
    // try to parse the value as an array
    try {
      arraySource = JSON.parse(value) as string[];
    } catch (error) {
      // was not an array. just happens to start with a bracket
      isArray = false;
    }
  }
  // Retrieve the values in the provided Excel.Table
  const result = await searchTableForMatch(tableName, value, isArray, arraySource);
  return result;
}

/**
 * Returns a mapped json array against the provided Excel table. If a value is not found in the table, the original value is returned.
 * @customfunction
 * @param {string} value Json Array value to use for mapping.
 * @param {string} tableName Excel range to map the value from.
 * @returns {Promise<string>} The field value of the offering.
 */
async function GET_MAPPED_VALUE_FROM_ARRAY(value: string, tableName: string): Promise<string> {
  if (!tableName || tableName === '') {
    return value;
  }
  // As this is just a wrapper using the same code for the GET_MAPPED_VALUE_BY_ID function,
  // we actually support both arrays and single values.
  // determine is the value returned is an array
  let isArray = value.startsWith('[');
  let arraySource: string[] = [];
  if (isArray) {
    // try to parse the value as an array
    try {
      arraySource = JSON.parse(value) as string[];
    } catch (error) {
      // was not an array. just happens to start with a bracket
      isArray = false;
    }
  }
  // Retrieve the values in the provided Excel.Table
  const result = await searchTableForMatch(tableName, value, isArray, arraySource);
  return result;
}

async function searchTableForMatch(
  tableName: string,
  searchValue: string,
  isArray: boolean,
  sourceArray: string[] = []
): Promise<string> {
  return Excel.run(async context => {
    let table: Excel.Table | undefined = undefined;
    try {
      // Get the table
      table = context.workbook.tables.getItem(tableName);

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!table) {
        throw new Error(`Table "${tableName}" not found`);
      }

      // Get the values
      const range = table.getRange().load('values');
      await context.sync();

      // Search for matches on column 1 and return the values in column 2
      const values = range.values as string[][];
      const result: string[] = [];
      if (isArray) {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < sourceArray.length; i++) {
          const index = values.findIndex(row => row[0] === sourceArray[i]);
          if (index !== -1) {
            result.push(values[index][1]);
          } else {
            result.push(sourceArray[i]);
          }
        }
        return JSON.stringify(result);
      } else {
        const index = values.findIndex(row => row[0] === searchValue);
        if (index !== -1) {
          return values[index][1];
        } else {
          return searchValue;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  });
}

export {
  FORMAT_TEMPLATE,
  GET_ARRAY_LENGTH,
  GET_ARRAY_VALUE,
  GET_FIELD_BY_NAME,
  GET_LIST_FROM_ARRAY_WITH_DELIMITER,
  GET_MAPPED_VALUE_BY_ID,
  GET_MAPPED_VALUE_FROM_ARRAY,
};
