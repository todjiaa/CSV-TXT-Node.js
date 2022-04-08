import { createElement } from "./createElement.js";
import { tableSection } from "./variablesAndFlags.js";

// Create the table
const createTable = (rows) => {
    if (rows.length === 0) return;

    const [table] = createElement({
        structural: {
            tag: "table",
            parent: tableSection,
            insertMethod: "append"
        },
        attributes: {
            class: "table-section__table"
        }
    })
    return table;
}

// Create the table Head, but only if header is available and if there is any available data as a result of the comparison.
const createTableHeadRow = (rows, tableHead, table) => {
    if (tableHead.length === 0 || rows.length === 0) return;  

    const [tr] = createElement({
        structural: {
            tag: "tr", 
            parent: table,
            insertMethod: "append"
        }
    })

    tableHead.forEach(column => {
        createElement({
            structural: {
                tag: "th", 
                parent: tr,
                insertMethod: "append"
            },
            attributes: {
                class: "table-section__th"
            },
            props: {
                innerText: column
            }
        })
    })
}

// Create the table rows if there is any data available after the comparison
const createTableRows = (rows, table) => {
    if (rows.length === 0) return;

    rows.forEach(row => {
        const [tr] = createElement({
            structural: {
                tag: "tr", 
                parent: table,
                insertMethod: "append"
            }
        })

        row.forEach(column => {
            createElement({
                structural: {
                    tag: "td", 
                    parent: tr, 
                    insertMethod: "append"
                },
                attributes: {
                    class: "table-section__td" 
                },
                props: {
                    innerText: column
                }
            })
        })
    })
}

// Write the results after comparison of the files in a table. Create a table and import all the data in it. 
export const createTableInit = (rows, tableHead) => {
    // Call the table creation function
    const table = createTable(rows);

    // Call the table head row creation function
    createTableHeadRow(rows, tableHead, table);

    // Call the table row creation function
    createTableRows(rows, table);
}