import { VariantReportType } from "../PreprocessingService/PreprocessingService";
import { FormattedParsedByProblemsFileInterface } from "../XmlToJsonFormatter/types";
import { groupReportsByProp, sortByPriorityGroups } from "./helpers";
import { compose } from "ramda";

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

export interface FlattenedReportsInterface
  extends FormattedParsedByProblemsFileInterface {
  fileName: string;
  reportType: VariantReportType;
}

export enum LevelProblem {
  ERROR = "ERROR",
  WARNING = "WARNING",
  WEAK_WARNING = "WEAK WARNING",
  OTHER = "OTHER",
}

export type PriorityType = typeof LevelProblem[keyof typeof LevelProblem][];

class AggregateDataService {
  private sortAggregatedDataByPriorityGroup(
    groups: AggregatedReportsInterface[],
    priority: PriorityType
  ) {
    return groups.map((group) => ({
      name: group.name,
      groups: group.groups.map((subGroup) => ({
        name: subGroup.name,
        reports: sortByPriorityGroups(subGroup.reports, priority),
      })),
    }));
  }

  private groupByLanguagesReports(
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

    return groupedByLanguage.map((item: any) => ({
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
  }

  public aggregateData(
    groups: DataForAggregateInterface[]
  ): AggregatedReportsInterface[] {
    return this.sortAggregatedDataByPriorityGroup(
      this.groupByLanguagesReports(groups),
      [
        LevelProblem.ERROR,
        LevelProblem.WARNING,
        LevelProblem.WEAK_WARNING,
        LevelProblem.OTHER,
      ]
    );
  }
}

export default AggregateDataService;
