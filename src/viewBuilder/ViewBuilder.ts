import { AggregatedReportsInterface } from "../services/AggregateDataService/AggregateDataService";
import HtmlBuilder from "./builders/HtmlBuilder";

export interface ViewBuilderInterface {
  viewer: HtmlBuilder;
  render: (data: AggregatedReportsInterface[]) => any;
}

export enum ViewBuilderType {
  HTML,
}

const mapViewBuilder = {
  [ViewBuilderType.HTML]: HtmlBuilder,
};

class ViewBuilder implements ViewBuilderInterface {
  viewer: HtmlBuilder;

  constructor({ viewType }: { viewType: ViewBuilderType }) {
    this.viewer = new mapViewBuilder[viewType]();
  }

  public render(
    data: AggregatedReportsInterface[],
    generatedFileName?: string
  ) {
    return this.viewer.render(data, generatedFileName);
  }
}

export default ViewBuilder;
