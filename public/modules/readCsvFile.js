import { csvFileInput, fileNames, files, sessionStatus } from "./variablesAndFlags.js";
import { convertCsvFilesToArray } from "./convertCsvFilesToArray.js";
import { extractCsvFileId } from "./extractCsvFileId.js";
import { createCsvInputList } from "./createCsvInputList.js";
import { showNotification } from "./showHideNotification.js";

// Read each csv file, check if the file name exist, if not then create a list of loaded file names, load the files and once loaded convert each file to an array, extract their id's in usable format removing any automatically generated entry numbers from the exporting software of the files and at the end push all into an object called "files" with array property "csvFilesArray".
export const readCsvFile = () => {
    for (let i = 0; i < csvFileInput.files.length; i++) {
        const csvReader = new FileReader();
        
        csvReader.readAsText(csvFileInput.files[i], "windows-1251");

        if (!fileNames.csvFileNames.includes(csvFileInput.files[i].name)) {

            fileNames.csvFileNames.push(csvFileInput.files[i].name);

            createCsvInputList(csvFileInput.files[i].name);

            loadCsvFile(csvReader, csvFileInput.files[i].name);
        }
        else if (!sessionStatus.completed) {
            showNotification("data-loaded", `"${csvFileInput.files[i].name}" is already loaded`);
        }
    }
}

// Load the csv files 
const loadCsvFile = (csvReader, fileName) => {
    csvReader.addEventListener("load", (e) => {
        const [csvArray] = convertCsvFilesToArray(e.target.result, fileName);

        extractCsvFileId(csvArray);

        files.csvFilesArray.push(csvArray);
    })
}