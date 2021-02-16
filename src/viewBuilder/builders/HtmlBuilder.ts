import * as fs from "fs";
import path from "path";

import {AggregatedReportsInterface} from "../../services/AggregateDataService/AggregateDataService";

import {buildTemplate, renderMap} from "./helpers";

const renderTemplateByData = (data: AggregatedReportsInterface[]): string =>
    `<div>
        ${renderMap(data, (group) => {
            return `
                <div>
                    <h3>Тип обнаруженной проблемы: ${group.name}</h3>
                    ${renderMap(group.commonReports, (report) => {
                        return `${group.commonReports.map(report => `
                            <div style="margin-bottom: 10px">
                                ${renderMap(report.reports, (reportItem) => {
                                    return `
                                        <div style="margin-bottom: 10px">
                                            <div><strong>Уровень проблемы:</strong> ${reportItem.problem.severity}</div>
                                            <div><strong>Файл:</strong> ${reportItem.file}:${reportItem.line}</div>
                                            <div><strong>Описание проблемы:</strong> ${reportItem.description} [${reportItem.problem.text}]</div>
                                            <div><strong>Часть кода в которой возникла ошибка:</strong> ${reportItem.highlightedElement}</div>
                                        </div>`;
                                })}
                            </div>
                    `       )}`;
                        })
                    }
                </div>
            `;    
        })}
    </div>`

class HtmlBuilder {
    private renderTemplate = buildTemplate;

    public render(data: AggregatedReportsInterface[], generatedFileName: string = 'index'): string {
        const renderData = this.renderTemplate(renderTemplateByData(data));
        fs.writeFile(path.join(__dirname, '../../', `generatedFiles/${generatedFileName}.html`), renderData, function (err) {
            if (err) return console.log(err);
            console.log('Успешно сгенерирован html файл');
        });

        return this.renderTemplate(
            renderTemplateByData(data)
        );
    };
}

export default HtmlBuilder;