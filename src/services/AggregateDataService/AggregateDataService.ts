import { VariantReportType } from "../PreprocessingService/PreprocessingService";
import { FormattedParsedByProblemsFileInterface } from "../XmlToJsonFormatter/types";

export interface AggregatedReportsInterface {
  name: string;
  groups: {
    name: string;
    reports: FlattenedReportsInterface[];
  }[];
}

export interface DataForAggregateInterface {
  name: string;
  type: VariantReportType;
  data: FormattedParsedByProblemsFileInterface[];
}

interface FlattenedReportsInterface
  extends FormattedParsedByProblemsFileInterface {
  fileName: string;
  reportType: VariantReportType;
}

class AggregateDataService {
  public groupByLanguagesReports(
    data: DataForAggregateInterface[]
  ): AggregatedReportsInterface[] {
    const flattenedData: FlattenedReportsInterface[] = data
      .map((group) => {
        return group.data.map((subGroup) => ({
          ...subGroup,
          fileName: group.name,
          reportType: group.type,
        }));
      })
      .flat(Infinity) as FlattenedReportsInterface[];

    const groupedByLanguage: any = groupReportsByProp<{
      name: string;
      groups: FlattenedReportsInterface[];
    }>(flattenedData, "language", (group: any) => {
      return {
        name: !!group[0]["language"] ? group[0]["language"] : "other",
        groups: group,
      };
    });

    const groupedData = groupedByLanguage.map((item: any) => ({
      ...item,
      groups: groupReportsByProp<{
        name: string;
        reports: FlattenedReportsInterface[];
      }>(item.groups, "fileName", (group: any) => {
        return {
          name: !!group[0]["fileName"] ? group[0]["fileName"] : "other",
          reports: group,
        };
      }),
    }));

    console.log("groupedData-> ", JSON.stringify(groupedData, null, 2));

    return groupedData;
  }

  public aggregateData(
    groups: DataForAggregateInterface[]
  ): AggregatedReportsInterface[] {
    return this.groupByLanguagesReports(groups);
  }
}

function groupReportsByProp<T>(
  reports: FlattenedReportsInterface[],
  prop: keyof Omit<FlattenedReportsInterface, "problem">,
  callback: (params: any) => T
) {
  const groupedObject = reports.reduce<{
    [key: string]: FlattenedReportsInterface[];
  }>((acc, current) => {
    const key = current[prop] ? current[prop] : "other";
    acc[key] = acc[key] ? [...acc[key], current] : [current];
    return acc;
  }, {});

  return Object.values(groupedObject).map(callback);
}

export default AggregateDataService;
