import parser from "fast-xml-parser";

interface ConfigXmlFetcherConstructorInterface {
    validationOptions: boolean;
    ignoreAttributes: boolean;
    parseAttributeValue: boolean;
}

interface XmlFetcherInterface {
    parseToJson: (xmlData: string) => JSON;
}

class XmlFetcher implements XmlFetcherInterface {

    private readonly validationOptions: boolean;
    private readonly ignoreAttributes: boolean;
    private readonly parseAttributeValue: boolean;

    constructor({
                    ignoreAttributes,
                    parseAttributeValue,
                    validationOptions
                }: ConfigXmlFetcherConstructorInterface) {
        this.ignoreAttributes = ignoreAttributes;
        this.parseAttributeValue = parseAttributeValue;
        this.validationOptions = validationOptions;
    }

    public parseToJson(xmlData: string): any {
        return parser.parse(
            xmlData,
            {
                ignoreAttributes: this.ignoreAttributes,
                parseAttributeValue: this.parseAttributeValue,
            },
            this.validationOptions
        );
    };
}

export default XmlFetcher;