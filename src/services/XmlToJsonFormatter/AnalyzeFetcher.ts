import FileService from "../FileService";
import XmlFetcher from "../XmlFetcher";

import {ParsedXmlFileInterface} from "./types";
import {PreprocessServiceInterface} from "../PreprocessingService/PreprocessingService";

const fileService = new FileService();

class AnalyzeFetcher {
    private fetcher: XmlFetcher;
    private preprocessService: PreprocessServiceInterface;

    constructor({
                    fetcher,
                    preprocessService
                }: {
        fetcher: XmlFetcher;
        preprocessService: PreprocessServiceInterface;
    }) {
        this.fetcher = fetcher;
        this.preprocessService = preprocessService;
    }

    private toJson = async (dirPath: string) => {
        const files = await fileService.readDir(dirPath);

        const filesData = files.map(async (fileName: string) => {
            const dataFile = await fileService.readFile(`${dirPath}/${fileName}`);
            const parsedData: ParsedXmlFileInterface = await this.fetcher.parseToJson(dataFile);

            return {
                fileName,
                parsedData
            };
        });

        return Promise.all(filesData);
    }

    public async parse(dirPath: string) {
        const parsedData = await this.toJson(dirPath);

        return this.preprocessService.formatData(parsedData);
    };
}

export default AnalyzeFetcher;