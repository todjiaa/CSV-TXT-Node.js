import { csvFileIdCellNumber, txtFileIdCellNumber } from "./variablesAndFlags.js";

// Compare both csv and txt arrays and return those that are missing in the csv array 
// export const getMissingRowsInCsv = (csvArray, txtArray) => {
//     const commonRows = [];

//     csvArray.forEach(csvRow => {
//         txtArray.forEach(txtRow => {
//             if (csvRow[csvFileIdCellNumber-1] === txtRow[txtFileIdCellNumber-1]) {
//                 commonRows.push(csvRow);
//             }
//         })
//     })
//     return [csvArray.filter(row => !commonRows.includes(row))];
// }


export const compareFiles = (csvArray, txtArray) => {
    const commonRows = [];
    const wrongVatNumberInvoices = [];
    
    csvArray.forEach(csvRow => {
        txtArray.forEach(txtRow => {
            if (csvRow[csvFileIdCellNumber-1] === txtRow[txtFileIdCellNumber-1]) {
                commonRows.push(csvRow);

                if (csvRow[0] !== txtRow[4]) {
                    wrongVatNumberInvoices.push(txtRow);
                }
            }
        })
        
    })
    const missingRowsArray = csvArray.filter(row => !commonRows.includes(row));

    return [missingRowsArray, wrongVatNumberInvoices];
}