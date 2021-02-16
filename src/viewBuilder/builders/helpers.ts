export const buildTemplate = (appendHtml: string): string => {
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

export const renderMap = <ArrayType, ReturnType>(
    array: ArrayType[],
    callback: (
        item: ArrayType,
        index: number,
        array: ArrayType[]
    ) => ReturnType
) => array.map(callback).join(" ");