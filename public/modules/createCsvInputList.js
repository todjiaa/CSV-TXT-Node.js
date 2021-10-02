import { createElement } from "./createElement.js";
import { csvUl, sessionStatus } from "./variablesAndFlags.js";

// Create a list with the names of the loaded csv files
export const createCsvInputList = (csvFilesName) => {
    if (!sessionStatus.completed) {
        createElement({
            tagName: "li",
            parent: csvUl,
            className: "csv-li",
            innerText: csvFilesName
        })
        csvUl.parentElement.classList.add("txt-csv-border");
    }
}