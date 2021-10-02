import {
    sessionStatus,
    txtUl, 
    csvUl,
    txtFileInput,
    csvFileInput,
    files,
    fileNames,
    downloadWrapper,
    downloadButton,
    // downloadInput
} from "./variablesAndFlags.js";

import { hideNotification } from "./showHideNotification.js";

// Reset function that clears the table, the table header, the txt and csv list names, hiding the border dynamically created for the list names, clear the input values if any, reset both txt and csv file arrays, reset both txt and csv file name arrays, hide the reset notification if shown and reseting the flag for the status of the current session. 
export const resetSession = () => {
    const tableCsv = document.querySelectorAll(".table-csv");
    const tableTitle = document.querySelectorAll(".table-title");

    if (sessionStatus.completed) {
        tableCsv.forEach(table => {
            table.remove();
        })
        tableTitle.forEach(title => {
            title.remove();
        }) 

        txtUl.innerHTML = null;
        csvUl.innerHTML = null;

        txtUl.parentElement.classList.remove("txt-csv-border");
        csvUl.parentElement.classList.remove("txt-csv-border");

        downloadWrapper.classList.remove("show-flex");
        downloadButton.disabled = false;

        txtFileInput.value = null;
        csvFileInput.value = null;

        files.txtFilesArray = [];
        files.csvFilesArray = [];
        
        fileNames.txtFileNames = [];
        fileNames.csvFileNames = [];

        hideNotification();
    }
    sessionStatus.completed = false;
}