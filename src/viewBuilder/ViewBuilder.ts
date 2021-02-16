import {AggregatedReportsInterface} from "../services/AggregateDataService/AggregateDataService";
import HtmlBuilder from "./builders/HtmlBuilder";

export interface HtmlViewerInterface {
    render: (data: AggregatedReportsInterface[]) => HTMLElement;
}

export interface ViewBuilderInterface {
    viewer: HtmlBuilder | TextBuilder;
    render: (data: AggregatedReportsInterface[]) => any;
}

export enum ViewBuilderType {
    HTML,
    TEXT
}

class TextBuilder {
    render(data: AggregatedReportsInterface[]) {
        return "";
    };
}

const mapViewBuilder = {
    [ViewBuilderType.HTML]: HtmlBuilder,
    [ViewBuilderType.TEXT]: TextBuilder,
}

class ViewBuilder implements ViewBuilderInterface {
    viewer: HtmlBuilder | TextBuilder;

    constructor({
        viewType
    }: {
        viewType: ViewBuilderType
    }) {
        this.viewer  = new mapViewBuilder[viewType];
    }

    public render(data: AggregatedReportsInterface[]) {
        return this.viewer.render(data);
    };

}

export default ViewBuilder;