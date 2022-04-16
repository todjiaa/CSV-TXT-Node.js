const createWorksheetName = (workBook, obj) => {
    return [workBook.addWorksheet(`${obj.category} в ${obj.fileName}`)] 
}

const fillWorkSheet = (workSheet, rowIndex, columnIndex, data, style) => {
    workSheet.cell(rowIndex+1, columnIndex+1)
    .string(data)
    .style(style);
}

const setExcelSheetColumnWidth = (workSheet, rowIndex, columnIndex, data) => {
    if (rowIndex < 1) {
        workSheet.column(columnIndex+1).setWidth(data.length);
    }
}

module.exports = (data, workBook, style) => {
    data.forEach(file => {
        file.forEach(obj => {
            if (obj.invoices.length === 0) return

            const [workSheetName] = createWorksheetName(workBook, obj)

            obj.invoices.forEach((rowData, rowIndex) => {
                rowData.forEach((cellData, cellIndex) => {
                    fillWorkSheet(workSheetName, rowIndex, cellIndex, cellData, style);

                    setExcelSheetColumnWidth(workSheetName, rowIndex, cellIndex, cellData);
                })
            })
        })
    })
}