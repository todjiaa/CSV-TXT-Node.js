import { showNotification } from "./notification.js";
import { sessionStatus, txtFileInput, csvFileInput, notificationDuration } from "./variablesAndFlags.js";
import { readTxtFile } from "./readAndSortTxtFile.js";
import { readCsvFile } from "./readAndSortCsvFile.js";

// Txt input change event listener
export const onTxtInputChange = (e) => {
    // Show notification requiring the session to be reset if the user tryes to load a new txt file after the complition of the current session 
    if (sessionStatus.completed) {
        showNotification("data-notification", "Please reset the current session before you continue", notificationDuration);
    }

    // Check if any file is choosen then call the read function, else if canceled button is pressed don't do anything
    if (txtFileInput.value.length !== 0) {
        readTxtFile();

        // Remove the value of the input so it doesn't mess with the input change event listener. For example if same file added again and if the value is not removed from the input the "onchange" event listener will not trigger the function displaying notification that this file is already loaded. 
        txtFileInput.value = null;
    }
}

// Csv input change event listener 
export const onCsvInputChange = (e) => {
    // Show notification requiring the session to be reset if the user tryes to load a new csv file after the complition of the current session 
    if (sessionStatus.completed) {
        showNotification("data-notification", "Please reset the current session before you continue", notificationDuration);
    }

    // Check if any file is choosen then call the read function, else if canceled button is pressed don't do anything
    if (csvFileInput.value.length !== 0) {
        readCsvFile();

        // Remove the value of the input so it doesn't mess with the input change event listener. For example if same file added again and if the value is not removed from the input the "onchange" event listener will not trigger the function displaying notification that this file is already loaded.
        csvFileInput.value = null;
    }
}
