import XmlFetcher from "./services/XmlFetcher";
import AnalyzeFetcher from "./services/XmlToJsonFormatter/AnalyzeFetcher";
import XmlFetcherPreprocessing from "./services/PreprocessingService/PreprocessingService";
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

const getFormattedData = async () => {
  const test = await analyzeFetcher.parse("../files/inseptions");

  const aggregatedData = aggregateService.aggregateData(test);

  viewBuilder.render(aggregatedData, "parsedData");
};
getFormattedData();
