import { createElement } from "./createElement.js";
import { tableSection } from "./variablesAndFlags.js";

// Get the output for the data atribute based on the check if any data is available. If there is available data show the file name of where the data comes from and the available data count. If no data show a notification - there is no data available in that specific file. 
const getAttributeValue = (object, tableTitle) => {
    if (object.invoices.length === 0) {
        return `*Няма ${object.category} в ${object.fileName} файл`
    }
    return tableTitle;
}

// Create a Title for the table checking for the length of the data after comparison. Check if any data available and if not notify the user for it.
export const createTableTitle = (object, tableTitle) => {

    const attributeValue = getAttributeValue(object, tableTitle);

    const [h2] = createElement({
        structural: {
            tag: "h2", 
            parent: tableSection, 
            insertMethod: "append"
        },
        attributes: {
            class: "table-section__table-title",
            "data-table-title": attributeValue,
        }
    })
    h2.innerText = h2.getAttribute("data-table-title");
}