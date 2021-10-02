import { createTable } from "./createTable.js";
import { createTableTitle } from "./createTableTitle.js";
import { noEmptyStrings } from "./noEmptyStrings.js";

export const sortTheData = (filesArray, wrongVatNumbers) => {
    let missingInvoices = [];

    let allTheSortedData = [];

    filesArray.forEach(file => {
        file.forEach(row => {
            if (row[0].startsWith("BG")) {
                const rowNoQuotes = row.map(line => {
                    return line.split(" ").join("").replace(/['"]+/g,"").replace(/[,]+/g," ");
                })

                missingInvoices.push(rowNoQuotes);
            }
        })

        const tableTitle = `*${missingInvoices.length} ${missingInvoices.length <= 1 ? "Липсваща фактура:" : "Липсващи фактури:"} ${file[0][0]}`;

        const tableHead = file[1];

        const header = tableHead.filter(noEmptyStrings);

        header.splice((header.length-1), 1, "Име на файла");

        header.splice(4, 1, "Номер на фактура");

        const headerNoCommas = header.map(row => {
            return row = row.replace(/,/g, '');
        })

        createTableTitle(
            missingInvoices, 
            "data-missing", 
            tableTitle,
            "No Missing Invoices in CSV File"
        );
        createTable(missingInvoices, header);

        createTableTitle(
            wrongVatNumbers,
            "data-vat", 
            "The following are invoices with wrong VAT numbers:",
            "All VAT numbers are matching"
        );
        createTable(wrongVatNumbers);


        // allTheSortedData.push(tableTitleNoCommas, [headerNoCommas], missingInvoices);
        allTheSortedData.push([headerNoCommas], missingInvoices);


        missingInvoices = [];
    })

    return [allTheSortedData]
}