import path from "path";
import fs from "fs";

import XmlFetcher from "./services/XmlFetcher";
import XmlFetcherPreprocessing from "./services/PreprocessingService/PreprocessingService";
import AnalyzeFetcher from "./services/XmlToJsonFormatter/AnalyzeFetcher";
import AggregateDataService from "./services/AggregateDataService/AggregateDataService";

import ViewBuilder, { ViewBuilderType } from "./viewBuilder/ViewBuilder";

const xmlFetcher = new XmlFetcher({
  validationOptions: true,
  ignoreAttributes: false,
  parseAttributeValue: true,
});

const xmlFetcherPreprocessing = new XmlFetcherPreprocessing();

const analyzeFetcher = new AnalyzeFetcher({
  preprocessService: xmlFetcherPreprocessing,
  fetcher: xmlFetcher,
});

const viewBuilder = new ViewBuilder({
  viewType: ViewBuilderType.HTML,
});

const aggregateService = new AggregateDataService();

const main = async (input: string, output: string) => {
  const inputPath = path.resolve(input);
  const outputPath = path.resolve(output);

  if (!fs.existsSync(inputPath)) {
    throw new Error("Input directory is not exist!");
  }

  const parsedData = await analyzeFetcher.parse(inputPath);
  const aggregatedData = aggregateService.aggregateData(parsedData);
  viewBuilder.render(aggregatedData, outputPath);
};

export default main;
