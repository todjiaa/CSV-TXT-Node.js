import { createElement } from "./createElement.js";
import { txtUl, sessionStatus } from "./variablesAndFlags.js";

// Create a list with the names of the loaded txt files
export const createTxtInputList = (txtFilesName) => {
    if (!sessionStatus.completed) {
        createElement({
            tagName: "li",
            parent: txtUl,
            className: "txt-li",
            innerText: txtFilesName
        })
        txtUl.parentElement.classList.add("txt-csv-border");
    }
}