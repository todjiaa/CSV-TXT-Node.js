import { 
    csvFileInput,
    fileNames, 
    files, 
    sessionStatus, 
    csvFileIdCell, 
    comparisonStatus,
    notificationDuration
} from "./variablesAndFlags.js";
import { addFileNameToArrayRows } from "./addFileNameToArrayRows.js";
import { createCsvInputList } from "./createCsvInputList.js";
import { showNotification } from "./notification.js";
import { noEmptyStrings } from "./noEmptyStrings.js";

// Convert the csv files from strings to arrays
const convertCsvFilesToArray = (csv) => {
    return [csv.split("\n").map(row => row.split(";"))];
}

// Remove the automatically generated 0 numbers at the beginning of each csv id which comes from the software that has exported the orifinal csv file 
const extractCsvFileId = (row) => {
    row[csvFileIdCell-1] = Number(row[csvFileIdCell-1]).toString();
}

// Remove the the quotes in each cell of each row 
const removeQuotes = (row) => {
    return row.map(cell => {
        // return cell.split(" ").join("").replace(/['"]+/g,"").replace(/[,]+/g," ");
        return cell.replace(/['"]+/g,"").replace(/[,]+/g," ");
    })
}

// Remove the cells that have no content in each row
const removeEmptyStrings = (row) => {
    return row.filter(noEmptyStrings)
}

const removeWhiteSpacesInArrayElements = (row) => {
    return row.map(element => {
        return element.trim();
    });
} 

// Sort the array
const sortCsvArray = (csvArray, fileName) => {
    return csvArray.map(row => {
        addFileNameToArrayRows(fileName, "push", row);

        extractCsvFileId(row);

        row = removeEmptyStrings(row);
        
        row = removeQuotes(row);

        row = removeWhiteSpacesInArrayElements(row);

        return row
    })
}

// Load and Sort the csv files 
const loadCsvFile = (csvReader, fileName) => {
    csvReader.addEventListener("load", (e) => {
        const [csvArrayRAW] = convertCsvFilesToArray(e.target.result, fileName);

        const csvArrayClean = sortCsvArray(csvArrayRAW, fileName);

        const csvObject = {
            csvFileName: fileName,
            csvArray: csvArrayClean
        }

        files.csvFilesArray.push(csvObject);
    })
}

// Read each csv file, check if the file name exist, if not then create a list of loaded file names, load the files and once loaded convert each file to an array, extract their id's in usable format removing any automatically generated entry numbers from the exporting software of the files and at the end push all into an object called "files" with array property "csvFilesArray".
export const readCsvFile = () => {
    for (let i = 0; i < csvFileInput.files.length; i++) {
        const csvReader = new FileReader();
        
        csvReader.readAsText(csvFileInput.files[i], "windows-1251");

        if (!fileNames.csvFileNames.includes(csvFileInput.files[i].name) && !comparisonStatus.started) {

            fileNames.csvFileNames.push(csvFileInput.files[i].name);

            createCsvInputList(csvFileInput.files[i].name);

            loadCsvFile(csvReader, csvFileInput.files[i].name);
        }
        else if (!comparisonStatus.started) {
            showNotification("data-notification", `"${csvFileInput.files[i].name}" is already loaded`, notificationDuration);
        }
        else if (comparisonStatus.started && !sessionStatus.completed) {
            showNotification("data-notification", "Comparison in progres, please wait for the results and try again", notificationDuration);
        }
    }
}