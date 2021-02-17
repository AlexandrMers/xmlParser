import * as fs from "fs";
import path from "path";

import { AggregatedReportsInterface } from "../../services/AggregateDataService/AggregateDataService";

import { buildTemplate, renderMap } from "./helpers";

const renderTemplateByData = (data: AggregatedReportsInterface[]): string =>
  `<div>
        ${renderMap(data, (group) => {
          return `
                <br>
                <div>
                    <h1>Язык: ${group.name}</h1>
                    ${renderMap(group.groups, (report) => {
                      return `
                        <div>
                            <h2><strong>Файл:</strong> ${report.name}</h2>
                            ${renderMap(report.reports, (reportItem) => {
                              return `
                                    <br>
                                    <div>
                                        <span><strong>Уровень проблемы:</strong> ${reportItem.problem.severity}</span><br>
                                        <span><strong>Файл:</strong> ${reportItem.file}:${reportItem.line}</span><br>
                                        <span><strong>Описание проблемы:</strong> ${reportItem.description} [${reportItem.problem.text}]</span><br>
                                        <span><strong>Часть кода в которой возникла ошибка:</strong> ${reportItem.highlightedElement}</span>
                                    </div>
                                `;
                            })}
                        </div>
                      `;
                    })}
                    <br>
                </div>
            `;
        })}
    </div>`;

class HtmlBuilder {
  private renderTemplate = buildTemplate;

  public render(data: AggregatedReportsInterface[], pathStr: string): string {
    const renderData = this.renderTemplate(renderTemplateByData(data));
    const dirPath = path.dirname(pathStr);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    fs.writeFile(pathStr, renderData, function (err) {
      if (err) return console.log(err);
      console.log(`Файл успешно сгенерирован в ${pathStr}`);
    });

    return this.renderTemplate(renderTemplateByData(data));
  }
}

export default HtmlBuilder;
