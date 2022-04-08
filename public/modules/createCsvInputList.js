import { addRemoveClass } from "./addRemoveClass.js";
import { createElement } from "./createElement.js";
import { 
    csvUl, 
    sessionStatus,
    csvListDescription 
} from "./variablesAndFlags.js";

// Create a list with the names of the loaded csv files
export const createCsvInputList = (csvFilesName) => {
    if (!sessionStatus.completed) {
        
        addRemoveClass(csvListDescription, "add", "hidden");

        createElement({
            structural: {
                tag: "li",
                parent: csvUl,
                insertMethod: "append"
            },
            attributes: {
                class: "inputs-section__csv-li"
            },
            props: {
                innerText: csvFilesName
            }
        })
        addRemoveClass(csvUl.parentElement, "add", "inputs-section__list-border");
    }
}