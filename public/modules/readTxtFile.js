import { txtFileInput, fileNames, files, sessionStatus } from "./variablesAndFlags.js";
import { convertTxtFilesToArray } from "./convertTxtFilesToArray.js";
import { extractTxtFileId } from "./extractTxtFileId.js";
import { extractTxtFileVatNumber } from "./extractTxtFileVatNumber.js";
import { createTxtInputList } from "./createTxtInputList.js";
import { showNotification } from "./showHideNotification.js";


// Read each txt file, check if the file name exist, if not then create a list of loaded file names, load the files and once loaded convert each file to an array, extract their id's in usable format removing any automatically generated entry numbers from the exporting software of the files and at the end push all into an object called "files" with array property "txtFilesArray".
export const readTxtFile = () => {
    for (let i = 0; i < txtFileInput.files.length; i++) {
        const txtReader = new FileReader();

        txtReader.readAsText(txtFileInput.files[i], "windows-1251");

        if (!fileNames.txtFileNames.includes(txtFileInput.files[i].name)) {

            fileNames.txtFileNames.push(txtFileInput.files[i].name);

            createTxtInputList(txtFileInput.files[i].name);

            loadTxtFile(txtReader, txtFileInput.files[i].name);
        }
        else if (!sessionStatus.completed) {
            showNotification("data-loaded", `"${txtFileInput.files[i].name}" is already loaded`);
        }
    }
}

// Load the txt Files
const loadTxtFile = (txtReader, fileName) => {
    txtReader.addEventListener("load", (e) => {
        const [txtArray] = convertTxtFilesToArray(e.target.result, fileName);
        
        extractTxtFileId(txtArray);

        extractTxtFileVatNumber(txtArray);

        files.txtFilesArray.push(txtArray);
    })
}