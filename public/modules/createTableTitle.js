import { createElement } from "./createElement.js";
import { missingInvoicesWrapper } from "./variablesAndFlags.js";


export const createTableTitle = (
    rows, 
    attributeName, 
    resultsAttributeValue,
    noResultsAttributeValue
    ) => {
    if (rows.length === 0) {
        const [h2] = createElement({
            tagName: "h2",
            parent: missingInvoicesWrapper,
            className: "table-title",
            attributeName: attributeName,
            attributeValue: noResultsAttributeValue
        })
        h2.innerText = h2.getAttribute(attributeName);
    }
    else {
        const [h2] = createElement({
            tagName: "h2",
            parent: missingInvoicesWrapper,
            className: "table-title",
            attributeName: attributeName,
            attributeValue: resultsAttributeValue
        })
        h2.innerText = h2.getAttribute(attributeName);
    }
}