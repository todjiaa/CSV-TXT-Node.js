import { 
    txtFileInput,
    fileNames, 
    files, 
    sessionStatus, 
    txtFileIdCell,
    txtIdEntryNumber,
    comparisonStatus,
    notificationDuration
} from "./variablesAndFlags.js";
import { createTxtInputList } from "./createTxtInputList.js";
import { showNotification } from "./notification.js";
import { noEmptyStrings } from "./noEmptyStrings.js";
import { addFileNameToArrayRows } from "./addFileNameToArrayRows.js";


// Convert the txt files from strings to arrays
const convertTxtFilesToArray = (txt) => {
    return [txt.split("\r\n").map(row => row.split(" ").filter(noEmptyStrings))];
}

// Remove the spaces between the company names causing a problem when spliting each row into array. Normally the company name suppose to be a single element in the array, but because of the spaces in between each word the program splits it into different elements which brakes the whole concept of finding other elements by index. 
const removeSpaceInCompanyNames = (row) => {
    const elBeforeCompName = row.slice(0, 5).join(" ");
    const companyName = [row.slice(5, -8).join(" ")];
    const elAfterCompName = row.slice(-8).join(" ");

    row = elBeforeCompName.concat(" ", elAfterCompName).split(" ");

    row.splice(5, 0, companyName.join(" "))

    return row;
}

// Remove the automatically generated entry number at the beginning of each txt id which comes from the software that has exported the orifinal txt file
const extractTxtFileId = (row, rowIndex) => {
    const id = row[txtFileIdCell-1];

    if (!id) return;

    txtIdEntryNumber.forEach(entry => {
        const entryNumber = rowIndex + 1 + entry;

        if (id.startsWith(entryNumber)) {
            row[txtFileIdCell-1] = id.substring(entryNumber.length);
        }
    })
}

// Remove the automatically generated entry number at the beginning of each txt VAT Number which comes from the software that has exported the orifinal txt file
const extractTxtFileVatNumber = (row) => {
    const vatNumberCell = row[4];

    if (!vatNumberCell) return;

    row[4] = vatNumberCell.split("").slice(10).join("");
}

const removeEmptyStrings = (row) => {
    return row.filter(noEmptyStrings);
}

// Sort the array
const sortTxtArray = (txtArray, fileName) => {
    return txtArray.map((row, rowIndex) => {
        row = removeSpaceInCompanyNames(row);

        row = removeEmptyStrings(row);

        addFileNameToArrayRows(fileName, "push", row);

        extractTxtFileId(row, rowIndex);

        extractTxtFileVatNumber(row);

        return row;
    })
}

// Load and Sort the txt Files
const loadTxtFile = (txtReader, fileName) => {
    txtReader.addEventListener("load", (e) => {
        const [txtArrayRaw] = convertTxtFilesToArray(e.target.result, fileName);

        const txtArrayClean = sortTxtArray(txtArrayRaw, fileName);

        const txtObject = {
            txtFileName: fileName,
            txtArray: txtArrayClean
        }

        files.txtFilesArray.push(txtObject);
    })
}

// Read each txt file, check if the file name exist, if not then create a list of loaded file names, load the files and once loaded convert each file to an array, extract their id's in usable format removing any automatically generated entry numbers from the exporting software of the files and at the end push all into an object called "files" with array property "txtFilesArray".
export const readTxtFile = () => {
    for (let i = 0; i < txtFileInput.files.length; i++) {
        const txtReader = new FileReader();

        txtReader.readAsText(txtFileInput.files[i], "windows-1251");

        if (!fileNames.txtFileNames.includes(txtFileInput.files[i].name) && !comparisonStatus.started) {

            fileNames.txtFileNames.push(txtFileInput.files[i].name);

            createTxtInputList(txtFileInput.files[i].name);

            loadTxtFile(txtReader, txtFileInput.files[i].name);
        }
        else if (!comparisonStatus.started) {
            showNotification("data-notification", `"${txtFileInput.files[i].name}" is already loaded`, notificationDuration);
        }
        else if (comparisonStatus.started && !sessionStatus.completed) {
            showNotification("data-notification", "Comparison in progres, please wait for the results and try again", notificationDuration);
        }
    }
}