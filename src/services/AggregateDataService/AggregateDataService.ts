import {
  PreformatDataInterface,
  VariantReportType,
} from "../PreprocessingService/PreprocessingService";
import {
  FormattedDataByDuplicatesParamsInterface,
  FormattedParsedByProblemsFileInterface,
} from "../XmlToJsonFormatter/types";

export interface AggregatedReportsInterface {
  name: string;
  type: VariantReportType;
  commonReports: {
    language: string;
    reports: FormattedParsedByProblemsFileInterface[];
  }[];
  duplicatesReports: FormattedDataByDuplicatesParamsInterface[][];
}

class AggregateDataService {
  public aggregateData(
    groups: PreformatDataInterface
  ): AggregatedReportsInterface[] {
    return groups.map((group) => {
      return {
        type: group.type,
        name: group.name,
        duplicatesReports:
          group.type === VariantReportType.DUPLICATES
            ? (group.data as FormattedDataByDuplicatesParamsInterface[][])
            : [],
        commonReports:
          group.type === VariantReportType.COMMON
            ? groupReportsByLanguage(
                group.data as FormattedParsedByProblemsFileInterface[]
              )
            : [],
      };
    });
  }
}

function groupReportsByLanguage(
  reports: FormattedParsedByProblemsFileInterface[]
) {
  const groupedObject = reports.reduce<{
    [key: string]: FormattedParsedByProblemsFileInterface[];
  }>((acc, current) => {
    const key = current.language ? current.language : "other";
    acc[key] = acc[key] ? [...acc[key], current] : [current];
    return acc;
  }, {});

  return Object.values(groupedObject).map((group) => {
    return {
      language: !!group[0].language ? group[0].language : "other",
      reports: group,
    };
  });
}

export default AggregateDataService;
