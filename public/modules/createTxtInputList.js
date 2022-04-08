import { addRemoveClass } from "./addRemoveClass.js";
import { createElement } from "./createElement.js";
import {
    txtUl, 
    sessionStatus,
    txtListDescription 
} from "./variablesAndFlags.js";

// Create a list with the names of the loaded txt files
export const createTxtInputList = (txtFilesName) => {
    if (!sessionStatus.completed) {

        addRemoveClass(txtListDescription, "add", "hidden");

        createElement({
            structural: {
                tag: "li",
                parent: txtUl,
                insertMethod: "append",
            },
            attributes: {
                class: "inputs-section__txt-li",
            },
            props: {
                innerText: txtFilesName
            }
        })
        addRemoveClass(txtUl.parentElement, "add", "inputs-section__list-border");
    }
}