import { ParsedXmlFileInterface } from "../XmlToJsonFormatter/types";

import { formatParsedDataByProblemsParams } from "../XmlToJsonFormatter/helpers";
import { DataForAggregateInterface } from "../AggregateDataService/AggregateDataService";

export enum VariantReportType {
  COMMON,
  DUPLICATES,
}

interface PreprocessingFormattingDataInterface {
  fileName: string;
  parsedData: ParsedXmlFileInterface;
}

export type MapTypeTranslations = { [key: string]: string };

export interface PreprocessServiceInterface {
  mapTranslations?: MapTypeTranslations;
  formatData: (
    data: PreprocessingFormattingDataInterface[]
  ) => DataForAggregateInterface[];
}

const mapTranslations: {
  [key: string]: string;
} = {
  ClassOverridesFieldOfSuperClassInspection:
    "Переопределение полей суперкласса PHP",
  MultipleReturnStatementsInspection:
    "Множественные точки возврата в методах классов PHP",
  PhpDynamicAsStaticMethodCallInspection:
    "Динамические методы классов используются, как статические PHP",
  PhpLanguageLevelInspection: "Синтаксические ошибки PHP",
  PhpMethodParametersCountMismatchInspection:
    "Несоответствие количества объявленных параметров используемым в методах PHP",
  PhpUnusedAliasInspection: "Неиспользуемые импорты в файлах PHP",
  PhpUnusedLocalVariableInspection: "Неиспользуемые переменные в файлах PHP",
  PhpUnusedParameterInspection: "Неиспользуемые параметры в методах PHP",
  PhpUnusedPrivateFieldInspection: "Неиспользуемые приватные поля классов PHP",
  PhpUnusedPrivateMethodInspection:
    "Неиспользуемые приватные методы классов PHP",
  SenselessProxyMethodInspection: "Бессмысленные прокси методы PHP",
};

class PreprocessingService implements PreprocessServiceInterface {
  formatData(
    data: PreprocessingFormattingDataInterface[]
  ): DataForAggregateInterface[] {
    return data.map((group) => {
      const nameWithoutExtension = group.fileName.split(".")[0];

      const type: VariantReportType = group.parsedData.root
        ? VariantReportType.DUPLICATES
        : VariantReportType.COMMON;

      const name = !!mapTranslations[nameWithoutExtension]
        ? mapTranslations[nameWithoutExtension]
        : nameWithoutExtension;

      return {
        name: name,
        type: type,
        data:
          type === VariantReportType.COMMON
            ? formatParsedDataByProblemsParams(
                group.parsedData.problems?.problem
              )
            : [],
      };
    });
  }
}

export default PreprocessingService;
