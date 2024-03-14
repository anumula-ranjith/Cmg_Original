// import { findOperationRootTypeOrThrow } from '@cmg/graphql-toolkit-introspection';
// import type {
//   GraphQLEnumType,
//   GraphQLInputFieldMap,
//   GraphQLInputType,
//   GraphQLOutputType,
//   GraphQLScalarType,
//   GraphQLSchema,
// } from 'graphql';
// import {
//   getNamedType,
//   GraphQLInputObjectType,
//   GraphQLObjectType,
//   isEnumType,
//   isInputObjectType,
//   isObjectType,
//   isScalarType,
// } from 'graphql';

// import type { TableInfo } from '../taskpane/hooks/useSelectedTable';

// const getRootWhereType = (source: string, schema: GraphQLSchema): GraphQLInputObjectType | null => {
//   try {
//     const queryType = schema.getType('Query');
//     if (queryType instanceof GraphQLObjectType) {
//       const fields = queryType.getFields()[source];
//       const whereArg = fields.args.find(arg => arg.name === 'where');
//       if (whereArg) {
//         const whereType = whereArg.type;
//         if (whereType instanceof GraphQLInputObjectType) {
//           return whereType;
//         }
//       }
//     }
//   } catch (error) {
//     console.error(`An error has ocurred at processing the where type for source: ${source}`);
//   }
//   return null;
// };

// const getWhereType = (root: GraphQLInputType, field: string): GraphQLInputType | null => {
//   let type: GraphQLInputType | null = root;
//   try {
//     const keys = field.split('.');
//     keys.forEach(key => {
//       if (type && isInputObjectType(type)) {
//         // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//         type = type.getFields()[key]?.type ?? null;
//       } else {
//         type = null;
//       }
//     });
//   } catch (error) {
//     type = null;
//     console.error(`An error has ocurred at processing the where type for field: ${field}`);
//   }
//   return type;
// };

// const getFieldType = (
//   source: string,
//   field: string,
//   schema: GraphQLSchema
// ): GraphQLOutputType | null => {
//   try {
//     const rootType = findOperationRootTypeOrThrow(schema, 'query', source);
//     const rootNamedType = getNamedType(rootType);
//     if (isObjectType(rootNamedType)) {
//       const fields = isObjectType(rootNamedType) ? Object.entries(rootNamedType.getFields()) : [];
//       const items = fields.filter(([fieldName]) => {
//         return fieldName === 'items';
//       });
//       if (items.length > 0) {
//         const itemsType = items[0][1].type;
//         const keys = field.split('.');
//         let entry: GraphQLOutputType | null = itemsType;
//         keys.forEach(key => {
//           const namedType = entry && getNamedType(entry);
//           if (isObjectType(namedType)) {
//             const entryField = Object.entries(namedType.getFields()).find(t => t[0] === key);
//             if (entryField) {
//               entry = entryField[1].type;
//             } else {
//               entry = null;
//             }
//           }
//         });
//         return entry;
//       }
//     }
//   } catch (error) {
//     console.error(
//       `An error has ocurred at processing the field type for source: ${source}, field: ${field}`
//     );
//   }
//   return null;
// };

// const convertEnumExcelFilterCriteriaToWhereClause = (
//   whereFields: GraphQLInputFieldMap,
//   criteria: Excel.FilterCriteria,
//   fieldType: GraphQLEnumType
// ) => {
//   const enumOptions = (fieldType.getValues() as { value: string }[]).map(f => f.value);
//   const { criterion1, criterion2, filterOn, values: filterValues } = criteria;
//   const supportedWhereOptions = Object.keys(whereFields);
//   const filterValidEnumOptions = (value: string): boolean => enumOptions.includes(value);
//   let result: string | null = null;

//   if (criterion1?.startsWith('=') && !criterion2 && supportedWhereOptions.includes('eq')) {
//     const value = criterion1.slice(1);
//     if (enumOptions.includes(value)) {
//       result = `eq: ${value}`;
//     }
//   } else if (
//     criterion1?.startsWith('=') &&
//     criterion2?.startsWith('=') &&
//     supportedWhereOptions.includes('in')
//   ) {
//     const values = [criterion1.slice(1), criterion2.slice(1)].filter(filterValidEnumOptions);
//     if (values.length > 0) {
//       result = `in: [${values.join(',')}]`;
//     }
//   } else if (
//     filterValues &&
//     filterOn === 'Values' &&
//     filterValues.length > 0 &&
//     supportedWhereOptions.includes('in')
//   ) {
//     const values = filterValues.map(v => v as string).filter(filterValidEnumOptions);
//     if (values.length > 0) {
//       result = `in: [${values.join(',')}]`;
//     }
//   } else if (criterion1?.startsWith('<>') && !criterion2 && supportedWhereOptions.includes('neq')) {
//     const value = criterion1.slice(2);
//     if (enumOptions.includes(value)) {
//       result = `neq: ${value}`;
//     }
//   } else if (
//     criterion1?.startsWith('<>') &&
//     criterion2?.startsWith('<>') &&
//     supportedWhereOptions.includes('nin')
//   ) {
//     const values = [criterion1.slice(2), criterion2.slice(2)].filter(filterValidEnumOptions);
//     if (values.length > 0 && supportedWhereOptions.includes('nin')) {
//       result = `nin: [${values.join(',')}]`;
//     }
//   }

//   return result ? `{${result}}` : null;
// };

// const getDateUsingDinamycDateCriteria = (dynamicCriteria: string) => {
//   const today = new Date();
//   const currentYear = today.getFullYear();
//   const currentMonth = today.getMonth();

//   switch (dynamicCriteria) {
//     case 'LastYear':
//       return {
//         gte: toISO(new Date(currentYear - 1, 0, 1)),
//         lte: toISO(new Date(currentYear - 1, 11, 31)),
//       };
//     case 'ThisYear':
//       return {
//         gte: toISO(new Date(currentYear, 0, 1)),
//         lte: toISO(new Date(currentYear, 11, 31)),
//       };
//     case 'NextYear':
//       return {
//         gte: toISO(new Date(currentYear + 1, 0, 1)),
//         lte: toISO(new Date(currentYear + 1, 11, 31)),
//       };
//     case 'LastMonth': {
//       const lastMonthLastDay = new Date(today);
//       lastMonthLastDay.setDate(0);
//       const lastMonthFirstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//       return {
//         gte: toISO(lastMonthFirstDay),
//         lte: toISO(lastMonthLastDay),
//       };
//     }
//     case 'ThisMonth': {
//       const thisMonthLastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//       return {
//         gte: toISO(new Date(today.getFullYear(), today.getMonth(), 1)),
//         lte: toISO(thisMonthLastDay),
//       };
//     }
//     case 'NextMonth': {
//       const nextMonthLastDay = new Date(today.getFullYear(), today.getMonth() + 2, 0);
//       return {
//         gte: toISO(new Date(today.getFullYear(), today.getMonth() + 1, 1)),
//         lte: toISO(nextMonthLastDay),
//       };
//     }
//     case 'Today':
//       return {
//         eq: toISO(today),
//       };
//     case 'Tomorrow': {
//       const tomorrow = new Date(today);
//       tomorrow.setDate(tomorrow.getDate() + 1);
//       return {
//         eq: toISO(tomorrow),
//       };
//     }
//     case 'Yesterday': {
//       const yesterday = new Date(today);
//       yesterday.setDate(yesterday.getDate() - 1);
//       return {
//         eq: toISO(yesterday),
//       };
//     }
//     case 'LastWeek': {
//       const lastWeekStart = new Date(today);
//       lastWeekStart.setDate(today.getDate() - 7);
//       const lastWeekEnd = new Date(today);
//       lastWeekEnd.setDate(today.getDate() - 1);
//       return {
//         gte: toISO(lastWeekStart),
//         lte: toISO(lastWeekEnd),
//       };
//     }
//     case 'ThisWeek': {
//       const thisWeekStart = new Date(today);
//       thisWeekStart.setDate(today.getDate() - today.getDay());
//       const thisWeekEnd = new Date(today);
//       thisWeekEnd.setDate(today.getDate() + (6 - today.getDay()));
//       return {
//         gte: toISO(thisWeekStart),
//         lte: toISO(thisWeekEnd),
//       };
//     }
//     case 'NextWeek': {
//       const nextWeekStart = new Date(today);
//       nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
//       const nextWeekEnd = new Date(today);
//       nextWeekEnd.setDate(today.getDate() + (13 - today.getDay()));
//       return {
//         gte: toISO(nextWeekStart),
//         lte: toISO(nextWeekEnd),
//       };
//     }
//     case 'AllDatesInPeriodJanuary':
//       return {
//         gte: toISO(new Date(currentYear, 0, 1)),
//         lte: toISO(new Date(currentYear, 1, 0)),
//       };
//     case 'AllDatesInPeriodFebruray':
//       return {
//         gte: toISO(new Date(currentYear, 1, 1)),
//         lte: toISO(new Date(currentYear, 2, 0)),
//       };
//     case 'AllDatesInPeriodMarch':
//       return {
//         gte: toISO(new Date(currentYear, 2, 1)),
//         lte: toISO(new Date(currentYear, 3, 0)),
//       };
//     case 'AllDatesInPeriodApril':
//       return {
//         gte: toISO(new Date(currentYear, 3, 1)),
//         lte: toISO(new Date(currentYear, 4, 0)),
//       };
//     case 'AllDatesInPeriodMay':
//       return {
//         gte: toISO(new Date(currentYear, 4, 1)),
//         lte: toISO(new Date(currentYear, 5, 0)),
//       };
//     case 'AllDatesInPeriodJune':
//       return {
//         gte: toISO(new Date(currentYear, 5, 1)),
//         lte: toISO(new Date(currentYear, 6, 0)),
//       };
//     case 'AllDatesInPeriodJuly':
//       return {
//         gte: toISO(new Date(currentYear, 6, 1)),
//         lte: toISO(new Date(currentYear, 7, 0)),
//       };
//     case 'AllDatesInPeriodAugust':
//       return {
//         gte: toISO(new Date(currentYear, 7, 1)),
//         lte: toISO(new Date(currentYear, 8, 0)),
//       };
//     case 'AllDatesInPeriodSeptember':
//       return {
//         gte: toISO(new Date(currentYear, 8, 1)),
//         lte: toISO(new Date(currentYear, 9, 0)),
//       };
//     case 'AllDatesInPeriodOctober':
//       return {
//         gte: toISO(new Date(currentYear, 9, 1)),
//         lte: toISO(new Date(currentYear, 10, 0)),
//       };
//     case 'AllDatesInPeriodNovember':
//       return {
//         gte: toISO(new Date(currentYear, 10, 1)),
//         lte: toISO(new Date(currentYear, 11, 0)),
//       };
//     case 'AllDatesInPeriodDecember':
//       return {
//         gte: toISO(new Date(currentYear, 11, 1)),
//         lte: toISO(new Date(currentYear, 12, 0)),
//       };
//     case 'LastQuarter': {
//       const lastQuarterStart = new Date(today.getFullYear(), currentMonth - 3, 1);
//       const lastQuarterEnd = new Date(today.getFullYear(), currentMonth, 0);
//       return {
//         gte: toISO(lastQuarterStart),
//         lte: toISO(lastQuarterEnd),
//       };
//     }
//     case 'ThisQuarter': {
//       const thisQuarterStart = new Date(today.getFullYear(), currentMonth - (currentMonth % 3), 1);
//       const thisQuarterEnd = new Date(
//         today.getFullYear(),
//         currentMonth - (currentMonth % 3) + 3,
//         0
//       );
//       return {
//         gte: toISO(thisQuarterStart),
//         lte: toISO(thisQuarterEnd),
//       };
//     }
//     case 'NextQuarter': {
//       const nextQuarterStart = new Date(
//         today.getFullYear(),
//         currentMonth + 3 - (currentMonth % 3),
//         1
//       );
//       const nextQuarterEnd = new Date(
//         today.getFullYear(),
//         currentMonth + 6 - (currentMonth % 3),
//         0
//       );
//       return {
//         gte: toISO(nextQuarterStart),
//         lte: toISO(nextQuarterEnd),
//       };
//     }
//     case 'YearToDate':
//       return {
//         gte: toISO(new Date(currentYear, 0, 1)),
//         lte: toISO(today),
//       };
//     case 'AllDatesInPeriodQuarter1':
//       return {
//         gte: toISO(new Date(currentYear, 0, 1)),
//         lte: toISO(new Date(currentYear, 3, 0)),
//       };
//     case 'AllDatesInPeriodQuarter2':
//       return {
//         gte: toISO(new Date(currentYear, 3, 1)),
//         lte: toISO(new Date(currentYear, 6, 0)),
//       };
//     case 'AllDatesInPeriodQuarter3':
//       return {
//         gte: toISO(new Date(currentYear, 6, 1)),
//         lte: toISO(new Date(currentYear, 9, 0)),
//       };
//     case 'AllDatesInPeriodQuarter4':
//       return {
//         gte: toISO(new Date(currentYear, 9, 1)),
//         lte: toISO(new Date(currentYear, 12, 0)),
//       };
//   }
//   return null;
// };

// function toISO(date: Date): string {
//   return date.toISOString().split('T')[0];
// }

// function excelDateToDate(excelSerial: string) {
//   // If its a valid number
//   if (!/^\d+$/.test(excelSerial)) {
//     return null;
//   }
//   const excelSerialNumber = parseInt(excelSerial, 10);
//   const excelStartDate = new Date(Date.UTC(1899, 11, 30));
//   excelStartDate.setUTCDate(excelStartDate.getUTCDate() + excelSerialNumber);
//   return excelStartDate.toString() === 'Invalid Date' ? null : excelStartDate;
// }

// const convertDateExcelFilterCriteriaToWhereClause = (
//   whereFields: GraphQLInputFieldMap,
//   criteria: Excel.FilterCriteria,
//   fieldType: GraphQLScalarType
// ) => {
//   const { criterion1, criterion2, dynamicCriteria } = criteria;
//   let result: string | null = null;

//   const dinamycDate = getDateUsingDinamycDateCriteria(dynamicCriteria as string);
//   if (dinamycDate) {
//     const eq = dinamycDate.eq ? `eq: '${dinamycDate.eq}',` : '';
//     const gte = dinamycDate.gte ? `gte: '${dinamycDate.gte}',` : '';
//     const lte = dinamycDate.lte ? `lte: '${dinamycDate.lte}',` : '';
//     result = `${eq}${gte}${lte}`;
//   }

//   if (criterion1?.startsWith('>') && criterion2?.startsWith('<')) {
//     const date1 = excelDateToDate(criterion1.slice(1));
//     const date2 = excelDateToDate(criterion2.slice(1));
//     if (date1 && date2) {
//       const gte = `gte: '${toISO(date1)}',`;
//       const lte = `lte: '${toISO(date2)}',`;
//       result = `${gte}${lte}`;
//     }
//   }

//   if (criterion1?.startsWith('>') && !criterion2) {
//     const date1 = excelDateToDate(criterion1.slice(1));
//     if (date1) {
//       const gte = `gte: '${toISO(date1)}',`;
//       result = `${gte}`;
//     }
//   }

//   if (criterion1?.startsWith('<') && !criterion2) {
//     const date1 = excelDateToDate(criterion1.slice(1));
//     if (date1) {
//       const lte = `lte: '${toISO(date1)}',`;
//       result = `${lte}`;
//     }
//   }

//   return result ? `{${result}}` : '';
// };

// type Filter = {
//   [key: string]: unknown | Filter;
// };

// export const buildWhereClause = (
//   tableInfo: TableInfo,
//   schema: GraphQLSchema,
//   criterias: Record<string, Excel.FilterCriteria>
// ): string | null => {
//   const rootWhereType = getRootWhereType(tableInfo.source, schema);
//   const filters: Filter = {};

//   if (!rootWhereType) {
//     return null;
//   }
//   const criteriasKeys = Object.keys(criterias);
//   criteriasKeys.forEach(fieldKey => {
//     const whereType = getWhereType(rootWhereType, fieldKey);
//     if (!whereType || !isInputObjectType(whereType)) {
//       return;
//     }
//     const criteria = criterias[fieldKey];
//     const whereFields = whereType.getFields();
//     const fieldType = getFieldType(tableInfo.source, fieldKey, schema);
//     if (!fieldType) {
//       return;
//     }
//     let clause: unknown = null;
//     if (isEnumType(fieldType)) {
//       clause = convertEnumExcelFilterCriteriaToWhereClause(whereFields, criteria, fieldType);
//     }
//     if (isScalarType(fieldType)) {
//       if (fieldType.name === 'Date') {
//         clause = convertDateExcelFilterCriteriaToWhereClause(whereFields, criteria, fieldType);
//       }
//       // TODO: Add Excel convert for numbers, strings, arrays
//     }
//     if (!clause) {
//       return;
//     }
//     const keys = fieldKey.split('.');
//     let current = filters;
//     keys.forEach((key, index) => {
//       if (!Object.keys(current).includes(key)) {
//         current[key] = {};
//       }
//       if (index === keys.length - 1 && clause) {
//         current[key] = clause;
//       } else {
//         current = current[key] as Filter;
//       }
//     });
//   });

//   return Object.keys(filters).length > 0
//     ? JSON.stringify(filters).replace(/["\\]/g, '').replace(/'/g, '"')
//     : null;
// };
