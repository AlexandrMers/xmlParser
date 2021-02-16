import XmlFetcher from "./services/XmlFetcher";
import AnalyzeFetcher from "./services/XmlToJsonFormatter/AnalyzeFetcher";
import PreprocessingService from "./services/PreprocessingService/PreprocessingService";
import AggregateDataService from "./services/AggregateDataService/AggregateDataService";

import ViewBuilder, {ViewBuilderType} from "./viewBuilder/ViewBuilder";

const xmlFetcher = new XmlFetcher({
    validationOptions: true,
    ignoreAttributes: false,
    parseAttributeValue: true
});

export const mapTranslations = {
        ClassOverridesFieldOfSuperClassInspection: "Переопределение полей суперкласса PHP",
        MultipleReturnStatementsInspection: "Множественные точки возврата в методах классов PHP",
        PhpDynamicAsStaticMethodCallInspection: "Динамические методы классов используются, как статические PHP",
        PhpLanguageLevelInspection: "Синтаксические ошибки PHP",
        PhpMethodParametersCountMismatchInspection: "Несоответствие количества объявленных параметров используемым в методах PHP",
        PhpUnusedAliasInspection: "Неиспользуемые импорты в файлах PHP",
        PhpUnusedLocalVariableInspection: "Неиспользуемые переменные в файлах PHP",
        PhpUnusedParameterInspection: "Неиспользуемые параметры в методах PHP",
        PhpUnusedPrivateFieldInspection: "Неиспользуемые приватные поля классов PHP",
        PhpUnusedPrivateMethodInspection: "Неиспользуемые приватные методы классов PHP",
        SenselessProxyMethodInspection: "Бессмысленные прокси методы PHP"
}

const preprocessService = new PreprocessingService(mapTranslations);

const analyzeFetcher = new AnalyzeFetcher(
    {
        preprocessService,
        fetcher: xmlFetcher
    }
);

const viewBuilder = new ViewBuilder({
    viewType: ViewBuilderType.HTML
});

const aggregateService = new AggregateDataService();

const getFormattedData = async () => {
    const test = await analyzeFetcher.parse('../files/inseptions');

    const aggregatedData = aggregateService.aggregateData([
            ...test,
        ]
    );

    viewBuilder.render(aggregatedData);
};
getFormattedData();