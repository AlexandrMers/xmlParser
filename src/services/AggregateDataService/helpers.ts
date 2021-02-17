import { compose, filter, flatten, groupBy, map } from "ramda";
import {
  FlattenedReportsInterface,
  LevelProblem,
  PriorityType,
} from "./AggregateDataService";

export const sortByPriorityGroups = (
  groups: FlattenedReportsInterface[],
  priority: PriorityType
) => {
  const groupedBy = groupBy<FlattenedReportsInterface>((group) => {
    let severity = group.problem.severity;
    return severity === LevelProblem.ERROR
      ? LevelProblem.ERROR
      : severity === LevelProblem.WARNING
      ? LevelProblem.WARNING
      : severity === LevelProblem.WEAK_WARNING
      ? LevelProblem.WEAK_WARNING
      : LevelProblem.OTHER;
  })(groups);

  return compose(
    (groups: FlattenedReportsInterface[]) =>
      flatten<FlattenedReportsInterface[]>(groups),
    filter(Boolean) as any,
    map<string, FlattenedReportsInterface[]>((priorityItem: string) => {
      return groupedBy[priorityItem]
        ? groupedBy[priorityItem]
        : groupedBy[LevelProblem.OTHER];
    })
  )(priority);
};

export function groupReportsByProp<T>(
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
