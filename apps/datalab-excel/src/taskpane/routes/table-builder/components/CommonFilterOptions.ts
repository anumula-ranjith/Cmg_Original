import { useMemo } from "react";
import { useSchema } from "../../../../client/graphql/instrospection/useSchema";
import { GraphQLEnumType, GraphQLInputObjectType } from "graphql";

export const GetSectorColumns = (): string[] => {
  const { schema } = useSchema();
  let sectorData: string[] = [];
  const offeringSchema = schema?.getQueryType()?.getFields()?.offerings?.args.filter(arg => arg.name === 'where')[0]?.type
  if (offeringSchema instanceof GraphQLInputObjectType) {
    const issuer = offeringSchema?.getFields()?.issuer?.type
    if (issuer instanceof GraphQLInputObjectType) {
      let sector = issuer?.getFields()?.sector?.type
      if (sector instanceof GraphQLInputObjectType) {
        let result = sector?.getFields()?.eq?.type
        if (result instanceof GraphQLEnumType) {
          const values = result?.getValues();
          sectorData = values.map(res => res.name)
        }
      }
    }
  }
  return sectorData;
}


export const GetRegionColumns = (): string[] => {
  const { schema } = useSchema();
  let regionData: string[] = [];
  const offeringSchema = schema?.getQueryType()?.getFields()?.offerings?.args.filter(arg => arg.name === 'where')[0]?.type
  if (offeringSchema instanceof GraphQLInputObjectType) {
    const exchangeRegion = offeringSchema?.getFields()?.exchangeRegion?.type
    if (exchangeRegion instanceof GraphQLInputObjectType) {
      let region = exchangeRegion?.getFields()?.eq?.type
      if (region instanceof GraphQLEnumType) {
        const values = region?.getValues();
        regionData = values.map(res => res.name)
      }

    }
  }
  return regionData;
}

export const GetOfferingTypeColumns = (): string[] => {
  const { schema } = useSchema();
  let offeringTypeData: string[] = [];
  const offeringSchema = schema?.getQueryType()?.getFields()?.offerings?.args.filter(arg => arg.name === 'where')[0]?.type
  if (offeringSchema instanceof GraphQLInputObjectType) {
    const type = offeringSchema?.getFields()?.type?.type
    if (type instanceof GraphQLInputObjectType) {
      let OfferingType = type?.getFields()?.eq?.type
      if (OfferingType instanceof GraphQLEnumType) {
        const values = OfferingType?.getValues();
        offeringTypeData = values.map(res => res.name)
      }

    }
  }
  return offeringTypeData;
}


export const formWhereClause = (filters: { [key: string]: any } = {}, schema): string => {
  const filtersData: { [key: string]: any } = {};
  const offeringSchema = schema?.getQueryType()?.getFields()?.offerings?.args.filter(arg => arg.name === 'where')[0]?.type;

  if (offeringSchema instanceof GraphQLInputObjectType) {
    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        if (key === 'startDate' || key === 'endDate' && filters[key] != null) {
          const pricingDate = offeringSchema?.getFields()?.pricingDate?.type;
          if (pricingDate instanceof GraphQLInputObjectType) {
            const dateType = key === 'startDate' ? 'gt' : 'lt';
            const dateFilter = pricingDate?.getFields()?.[dateType]?.type;
            const value = filters[key];
            const operator = dateType;

            if (dateFilter) {
              if (!filtersData.pricingDate) {
                filtersData.pricingDate = {};
              }
              filtersData.pricingDate[operator] = `"${value}"`;
            }
          }
        }
        if (key === 'region' && filters[key].length > 0) {
          const region = offeringSchema?.getFields()?.exchangeRegion?.type;
          if (region instanceof GraphQLInputObjectType) {
            const regionType = region?.getFields()?.eq?.type;
            const value = filters[key];
            const operator = 'in';

            if (regionType) {
              if (!filtersData.exchangeRegion) {
                filtersData.exchangeRegion = {};
              }
              filtersData.exchangeRegion[operator] = [`${[value]}`];
              
            }
          }
        }
        if (key === 'offeringType' && filters[key].length > 0) {
          const offeringType = offeringSchema?.getFields()?.type?.type;
          if (offeringType instanceof GraphQLInputObjectType) {
            const offering = offeringType?.getFields()?.eq?.type;
            const value = filters[key];
            const operator = 'in';

            if (offering) {
              if (!filtersData.type) {
                filtersData.type = {};
              }
              filtersData.type[operator] = [`${[value]}`];
            }
          }
        }
        if (key === 'sector' && filters[key].length > 0) {
          const issuer = offeringSchema?.getFields()?.issuer?.type;
          if (issuer instanceof GraphQLInputObjectType) {
            const sector = issuer?.getFields()?.sector?.type;
            if (sector instanceof GraphQLInputObjectType) {
              const sectoreq = sector?.getFields()?.eq?.type;
        
              if (sectoreq) {
                if (!filtersData.issuer) {
                  filtersData.issuer = {};
                }
        
                const value = filters[key];
        
                if (!filtersData.issuer.sector) {
                  filtersData.issuer.sector = `{ in: [${value}] }`;
                }
              }
            }
          }
        }
        if ((key === 'minGrossProceeds' || key === 'maxGrossProceeds' || key === 'minMarketCap' || key === 'maxMarketCap') && filters[key] !== null && filters[key] != 0) {
          const attributes = offeringSchema?.getFields()?.attributes?.type;
          if (attributes instanceof GraphQLInputObjectType) {
            const type = key.includes('Gross') ? 'latestGrossProceedsTotalUsd' : 'marketCapAtPricingUsd';
            const pricingrange = attributes?.getFields()?.[type]?.type;
            if (pricingrange instanceof GraphQLInputObjectType) {
              const dataType = key.includes('min') ? 'gt' : 'lt';
              const dataFilter = pricingrange?.getFields()?.[dataType]?.type;
              const value = filters[key] * 10**6;
              const operator = dataType;
              if (dataFilter) {
                if (!filtersData.attributes) {
                  filtersData.attributes = {} as Record<string, any>;
                }
                if (!filtersData.attributes[type]) {
                  filtersData.attributes[type] = {} as Record<string, any>;
                }
                filtersData.attributes[type][operator] = `${value}`;
              }
            }
          }
        }        
      }
    }
  }

  const formattedFiltersData = formatFiltersData(filtersData);

  return formattedFiltersData;
};

function formatFiltersData(data: { [key: string]: any }): string {
  const convertValueToString = (value: any): string => {
    if (Array.isArray(value)) {
      const arrayResult = value.map((item: any) => convertValueToString(item)).join(', ');
      return `[${arrayResult}]`;
    } else if (typeof value === 'object' && value !== null) {
      const innerResult = Object.entries(value)
        .map(([op, val]) => `${op}: ${convertValueToString(val)}`)
        .join(', ');

      return `{ ${innerResult} }`;
    } else {
      return typeof value === 'string' ? value : JSON.stringify(value);
    }
  };

  const result = Object.entries(data)
    .map(([key, value]) => `${key}: ${convertValueToString(value)}`)
    .join(', ');

  return `{ ${result} } order: {pricingDate: DESC}`;
}
