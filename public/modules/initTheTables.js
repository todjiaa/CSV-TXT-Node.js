import { createTableInit } from "./createTableInit.js";
import { createTableTitle } from "./createTableTitle.js";

// Arrange the table title with some prefixes
const arrangeTheTableTitleText = (object) => {
    return [`*${object.invoices.length} ${object.category} в ${object.fileName} файл`];
}

// Init the tables creation
export const initTheTables = (resultObjectFiles) => {
    resultObjectFiles.forEach(file => {
        file.forEach(object => {

            const [tableTitle] = arrangeTheTableTitleText(object);

            const tableHeader = object.header;
            
            createTableTitle(object, tableTitle);

            createTableInit(object.invoices, tableHeader);
        })
    })
}