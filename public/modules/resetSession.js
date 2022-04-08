import {
    sessionStatus,
    txtUl, 
    csvUl,
    txtFileInput,
    csvFileInput,
    txtListDescription,
    csvListDescription,
    files,
    fileNames,
    compareButton,
    downloadSection,
    downloadButton,
    comparisonStatus
} from "./variablesAndFlags.js";
import { closeAllNotifications } from "./notification.js";
import { addRemoveClass } from "./addRemoveClass.js";

// Reset function that clears the table, the table header, the txt and csv list names, hiding the border dynamically created for the list names, clear the input values if any, reset both txt and csv file arrays, reset both txt and csv file name arrays, hide the reset notification if shown and reseting the flag for the status of the current session. 
export const resetSession = () => {
    const table = document.querySelectorAll(".table-section__table");
    const tableTitle = document.querySelectorAll(".table-section__table-title");

    // if (sessionStatus.completed) {
        table.forEach(table => {
            table.remove();
        })
        tableTitle.forEach(title => {
            title.remove();
        }) 

        txtUl.innerHTML = null;
        csvUl.innerHTML = null;

        addRemoveClass(txtListDescription, "remove", "hidden");
        addRemoveClass(csvListDescription, "remove", "hidden");

        addRemoveClass(txtUl.parentElement, "remove", "inputs-section__list-border");
        addRemoveClass(csvUl.parentElement, "remove", "inputs-section__list-border");

        addRemoveClass(compareButton, "remove", "disabled");
        compareButton.disabled = false;

        addRemoveClass(downloadSection, "add", "hidden");
        addRemoveClass(downloadButton, "remove", "disabled");
        downloadButton.disabled = false;

        txtFileInput.value = null;
        csvFileInput.value = null;

        files.txtFilesArray = [];
        files.csvFilesArray = [];
        
        fileNames.txtFileNames = [];
        fileNames.csvFileNames = [];

        closeAllNotifications();
    // }
    sessionStatus.completed = false;
    comparisonStatus.started = false;
}