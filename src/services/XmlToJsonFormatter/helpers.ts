import {
  DataByDuplicatesParamsInterface,
  FormattedDataByDuplicatesParamsInterface,
  FormattedParsedByProblemsFileInterface,
  ParsedProblemFileInterface,
} from "./types";

export const formatParsedByProblemsData = (
  item: ParsedProblemFileInterface
) => ({
  file: item.file,
  description: item.description,
  highlightedElement: item.highlighted_element,
  language: item.language,
  line: item.line,
  problem: {
    id: item.problem_class["@_id"],
    severity: item.problem_class["@_severity"],
    text: item.problem_class["#text"],
  },
});

function formatDataDuplicatesParams(item: any) {
  return {
    line: item["@_line"],
    start: item["@_start"],
    end: item["@_end"],
    file: item["@_file"],
  };
}

export const formatParsedDataByDuplicatedParams = (
  items: DataByDuplicatesParamsInterface[] = []
): FormattedDataByDuplicatesParamsInterface[][] => {
  return items.map((item) => {
    return item.fragment.map(formatDataDuplicatesParams);
  });
};

export const formatParsedDataByProblemsParams = (
  items: ParsedProblemFileInterface[] | ParsedProblemFileInterface = []
): FormattedParsedByProblemsFileInterface[] => {
  return Array.isArray(items)
    ? items.map(formatParsedByProblemsData)
    : [formatParsedByProblemsData(items)];
};
