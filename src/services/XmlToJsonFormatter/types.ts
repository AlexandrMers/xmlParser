export interface FormattedJsonDataInterface {
    name: string;
    params: ParsedXmlFileInterface
};

export interface ParsedProblemFileInterface {
    file: string;
    line: number;
    problem_class: {
        "#text": string;
        "@_id": string;
        "@_severity": string;
    }
    description: string;
    highlighted_element: string;
    language: string;
}

export interface FormattedParsedByProblemsFileInterface {
    file: string;
    line: number;
    problem: {
        text: string;
        id: string;
        severity: string;
    }
    description: string;
    highlightedElement: string;
    language: string;
}

export interface ParsedXmlFileInterface {
    problems?: {
        problem: ParsedProblemFileInterface[] | ParsedProblemFileInterface;
    },
    root?: {
        duplicate: DataByDuplicatesParamsInterface[];
    }
}

export interface DataByDuplicatesParamsInterface {
    "@_cost": number;
    "@_hash": number;
    "fragment": {
        "@_file": string;
        "@_line": number;
        "@_start": number;
        "@_end": number;
    }[]
}

export interface FormattedDataByDuplicatesParamsInterface {
    line: number;
    start: number;
    end: number;
    file: string;
}