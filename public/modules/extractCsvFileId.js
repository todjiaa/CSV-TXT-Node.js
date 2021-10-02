import { csvFileIdCellNumber } from "./variablesAndFlags.js";

// Remove the automatically generated 0 numbers at the beginning of each csv id which comes from the software that has exported the orifinal csv file 
export const extractCsvFileId = (csvArray) => {
    csvArray.forEach(row => {
        row[csvFileIdCellNumber-1] = Number(row[csvFileIdCellNumber-1]).toString();
    })
}