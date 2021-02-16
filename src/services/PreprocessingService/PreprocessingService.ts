import {
    FormattedDataByDuplicatesParamsInterface,
    FormattedParsedByProblemsFileInterface,
    ParsedXmlFileInterface
} from "../XmlToJsonFormatter/types";

import {formatParsedDataByDuplicatedParams, formatParsedDataByProblemsParams} from "../XmlToJsonFormatter/helpers";

export enum VariantReportType {
    COMMON,
    DUPLICATES
}

interface FormattedReportsInterface<T> {
    name: string;
    type: VariantReportType;
    data: T;
}

interface PreprocessingFormattingDataInterface {
    fileName: string;
    parsedData: ParsedXmlFileInterface;
}

export type PreformatDataInterface =
    FormattedReportsInterface<FormattedParsedByProblemsFileInterface[]
    | FormattedDataByDuplicatesParamsInterface[][]>[];

export type MapTypeTranslations = {[key: string]: string};

export interface PreprocessServiceInterface {
    mapTranslations?: MapTypeTranslations;
    formatData: (data: PreprocessingFormattingDataInterface[])
        => PreformatDataInterface;
}

class PreprocessingService implements PreprocessServiceInterface {
    mapTranslations: {[key: string]: string} | undefined;

    constructor(mapTranslations?: MapTypeTranslations) {
        this.mapTranslations = mapTranslations;
    }

    formatData(data: PreprocessingFormattingDataInterface[]): PreformatDataInterface {
        return data.map(group => {
            const nameWithoutExtension = group.fileName.split('.')[0];

            const type: VariantReportType = group.parsedData.root
                ? VariantReportType.DUPLICATES
                : VariantReportType.COMMON;

            const name = this.mapTranslations && this.mapTranslations[nameWithoutExtension]
                ? this.mapTranslations[nameWithoutExtension]
                : nameWithoutExtension;

            return {
                name: name,
                    type: type,
                data: type === VariantReportType.COMMON
                    ? formatParsedDataByProblemsParams(group.parsedData.problems?.problem)
                    : formatParsedDataByDuplicatedParams(group.parsedData.root?.duplicate),
            }
        })
    }
}

export default PreprocessingService;