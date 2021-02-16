interface HtmlViewBuilder {
  render: (data: any[]) => HTMLElement;
}

interface AnalyzeModuleInterface {
  viewer: HtmlViewBuilder;
  renderData: (data: any[]) => void;
}

class AnalyzeModule implements AnalyzeModuleInterface {
  public viewer;

  constructor({ viewer }: { viewer: any }) {
    this.viewer = viewer;
  }

  renderData(data: any[]) {
    return this.viewer.render(data);
  }
}

export default AnalyzeModule;
