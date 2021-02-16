import {AggregatedReportsInterface} from "../../services/AggregateDataService/AggregateDataService";
import * as fs from "fs";

const buildTemplate = (appendHtml: string): string => {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Title</title>
        </head>
        <body>
            <div>
                ${appendHtml}
            </div>
        </body>
    </html>
`
};

const renderMap = <ArrayType, ReturnType>(
    array: ArrayType[],
    callback: (
        item: ArrayType,
        index: number,
        array: ArrayType[]
    ) => ReturnType
) =>
    array.map(callback).join(" ");

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

    public render(data: AggregatedReportsInterface[]): string {
        const renderData = this.renderTemplate(renderTemplateByData(data));
        fs.writeFile('./index.html', renderData, function (err) {
            if (err) return console.log(err);
            console.log('Успешно сгенерирован html файл');
        });

        return this.renderTemplate(
            renderTemplateByData(data)
        );
    };
}

export default HtmlBuilder;