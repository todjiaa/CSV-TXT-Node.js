import { noEmptyStrings } from "./noEmptyStrings.js";
import {
    csvFileIdCell,
    txtFileIdCell,
    csvFileVatNumberCell,
    txtFileVatNumberCell,
    csvFileVatValueCell, 
    txtFileVatValueCell
} from "./variablesAndFlags.js";

// Create the category name dynamically based on multiple results or a single result. 
const createCategoryName = (data, nameWhenSingleResult, nameWhenMultipleResults) => {
    if (data.length === 0 || data.length > 1) {
        return nameWhenMultipleResults;
    }
    return nameWhenSingleResult;
}

// Get the missing invoices when filtering the original csv array and the array which is the common result after comparing the original csv and txt arrays. 
const getMissingInvoices = (originalCsv, commonBetweenCsvAndTxt) => {
    return originalCsv.filter(row => !commonBetweenCsvAndTxt.includes(row));
}

// Extract only the Title from the csv file
const getTitleFromCsvFile = (csv) => {
    const csvTitle = csv[0][0];

    return csvTitle;
}

// Arrange the csv header cleaning some empty columns as well as editing some of the column names.
const arrangeCsvHeader = (csvHeader) => {
    if (csvHeader) {
        csvHeader.filter(noEmptyStrings);

        csvHeader.splice((csvHeader.length-1), 1, "Име на файла");

        csvHeader.splice(4, 1, "Номер на фактура");
    }
}

// Extract only the Header from the csv file
const getHeaderFromCsvFile = (csv) => {
    const csvHeader = csv[1];

    // Call the funcion arranging the csv header.
    arrangeCsvHeader(csvHeader);

    return csvHeader;
}

// Remove any headers and titles from the missing invoices 
const removeTitleAndHeaderInMissingInvoices = (array) => {
    return array.filter(row => row[0].startsWith("BG"));
}

// Extract the results of the comparison into an object
const extractResults = (resultOptions) => {
    const {
        csvFileName,
        txtFileName,
        csvFileTitle,
        csvFileHeader,
        txtFileHeader,
        missingInvoicesWithoutTitleAndHeader,
        invoicesWithWrongVatNumbers,
        invoicesWithWrongVatValue
    } = resultOptions;

    return [
        {
            fileName: csvFileName,
            title: csvFileTitle,
            header: csvFileHeader,
            category: createCategoryName(missingInvoicesWithoutTitleAndHeader, "Липсваща фактура", "Липсващи фактури"),
            invoices: missingInvoicesWithoutTitleAndHeader,
        },
        {
            fileName: txtFileName,
            header: txtFileHeader,
            category: createCategoryName(invoicesWithWrongVatNumbers, "Фактура с грешен данъчен номер", "Фактури с грешни данъчни номера"),
            invoices: invoicesWithWrongVatNumbers,
        },
        {
            fileName: txtFileName,
            header: txtFileHeader,
            category: createCategoryName(invoicesWithWrongVatValue, "Фактура с грешна ДДС стойност", "Фактури с грешни ДДС стойности"),
            invoices: invoicesWithWrongVatValue,
        }
    ]
}

// Check for those that have a wrong VAT number and extract them 
const getInvoicesWithWrongVatNumber = (csvRow, txtRow, invoicesWithWrongVatNumbers) => {
    if (csvRow[csvFileVatNumberCell-1] !== txtRow[txtFileVatNumberCell-1]) {
        invoicesWithWrongVatNumbers.push(txtRow);
    }
}

// Check for those that have a wrong VAT value and extract them
const getInvoicesWithWrongVatValue = (csvRow, txtRow, invoicesWithWrongVatValue) => {
    if (csvRow[csvFileVatValueCell-1] !== txtRow[txtFileVatValueCell-1]) {
        invoicesWithWrongVatValue.push(txtRow);
    }
}

// Check for those with the same id's and those starting only with "BG" and extract them
const getInvoicesWithSameId = (props) => {
    const {
        csvRow, 
        txtRow, 
        invoicesWithSameIdNumbers, 
        invoicesWithWrongVatNumbers, 
        invoicesWithWrongVatValue
    } = props;

    if (csvRow[csvFileIdCell-1] === txtRow[txtFileIdCell-1] && csvRow[0].startsWith("BG")) {
        invoicesWithSameIdNumbers.push(csvRow);
        
        // Get those invoices that have a wrong VAT number
        getInvoicesWithWrongVatNumber(csvRow, txtRow, invoicesWithWrongVatNumbers);

        // Get those invoices that have a wrong VAT value
        getInvoicesWithWrongVatValue(csvRow, txtRow, invoicesWithWrongVatValue);
    }
}

// Create a custom header for the txt file
const createHeaderForTxtFile = () => {
    return [
        "Идентификационен номер на контрагента",
        "Данъчен период",
        "Вид на документа",
        "Номер на фактура",
        "ДДС номер",
        "Име на контрагента",
        "Вид на стоката или обхват и вид на услугата",
        "Да се добави",
        "Да се добави",
        "Да се добави",
        "Да се добави",
        "Да се добави",
        "Да се добави",
        "Да се добави",
        "Име на файла"
    ]
}

// Loop through the csv and txt arrays
const loopCsvTxtArrays = (csvArray, txtArray, callback) => {
    csvArray.forEach(csvRow => {
        txtArray.forEach(txtRow => {
            callback(csvRow, txtRow);
        })
    })
}

// Loop through both csv and txt files and return those that are missing in the csv array, and check if there is some of them with wrong VAT Number in the txt file as well as wrong VAT Value also in the txt file 
const loopCsvTxtFiles = (csvFiles, txtFiles, callback) => {
    csvFiles.forEach((csvFile, csvFileIndex) => {
        const {
            csvFileName,
            csvArray
        } = csvFile;

        const invoicesWithSameIdNumbers = [];
        const invoicesWithWrongVatNumbers = [];
        const invoicesWithWrongVatValue = [];
        const txtFileNameArray = [];

        txtFiles.forEach(txtFile => {
            const {
                txtFileName,
                txtArray
            } = txtFile;

            txtFileNameArray.push(txtFileName);

            // Loop throuh each csv and txt array
            loopCsvTxtArrays(csvArray, txtArray, (csvRow, txtRow) => {

                // Get those invoices that have the same id
                getInvoicesWithSameId({
                    csvRow, 
                    txtRow, 
                    invoicesWithSameIdNumbers, 
                    invoicesWithWrongVatNumbers, 
                    invoicesWithWrongVatValue
                });
            })
        })

        // Extract those invoices that are missing 
        const missingInvoices = getMissingInvoices(csvArray, invoicesWithSameIdNumbers);

        // Extract only the missing invoices without any headers and titles 
        const missingInvoicesWithoutTitleAndHeader = removeTitleAndHeaderInMissingInvoices(missingInvoices);

        // Extract only the Title from the csv file
        const csvFileTitle = getTitleFromCsvFile(csvArray);

        // Extract only the Header from the csv file
        const csvFileHeader = getHeaderFromCsvFile(csvArray);
        
        // Extract "txtFileName" for each csv array iteration
        const txtFileName = txtFileNameArray[csvFileIndex];
        
        // Create a header for the txt file
        const txtFileHeader = createHeaderForTxtFile();

        // Create an object that contains all the result after comparison as well as category for each, title and header where available. 
        const result = extractResults({
            csvFileName,
            txtFileName,
            csvFileTitle, 
            csvFileHeader,
            txtFileHeader,
            missingInvoicesWithoutTitleAndHeader,
            invoicesWithWrongVatNumbers,
            invoicesWithWrongVatValue 
        })

        // Pass the result object in the callback for each file iteration
        callback(result);
    })
}

// Compare both csv and txt files and return an object that contains the invoices missing in the csv array, invoices with wrong VAT Number in the txt file as well as invoices with wrong VAT Value also in the txt file 
export const compareFiles = (csvObject, txtObject) => {
    const resultObject = [];
    
    // Loop throuh each csv and txt file
    loopCsvTxtFiles(csvObject, txtObject, (result) => {
        resultObject.push(result);
    })

    return resultObject;
}