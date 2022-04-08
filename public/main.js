import { compareFiles } from "./modules/compareFiles.js";
import { onTxtInputChange, onCsvInputChange } from "./modules/onInputChange.js";
import { resetSession } from "./modules/resetSession.js";
import { initTheTables } from "./modules/initTheTables.js";
import { addRemoveClass } from "./modules/addRemoveClass.js";
import {
    txtFileInput,
    csvFileInput, 
    sessionStatus,
    comparisonStatus, 
    txtUl, 
    csvUl, 
    files,
    compareButton,
    downloadForm,
    downloadSection,
    downloadButton
} from "./modules/variablesAndFlags.js";

// Init the algorithm of comparing both csv and txt files
const compareFilesInit = () => {
    if (!sessionStatus.completed && txtUl.childElementCount !== 0 && csvUl.childElementCount !== 0) {
        comparisonStatus.started = true;
        
        // Add a loading gif inside the compare button while the files are getting compared and ready 
        addRemoveClass(compareButton, "add", "loading-gif");
        // Add a class which makes the compare button looking like disabled after it's been clicked
        addRemoveClass(compareButton, "add", "disabled");
        // Disable the comapre button after it's been clicked
        compareButton.disabled = true;
        
        // Call the function that compares the csv and txt files 
        const resultObject = compareFiles(files.csvFilesArray, files.txtFilesArray);
        
        // Call the function that creates the tables with the results after comparison 
        initTheTables(resultObject);  

        // Remove the loading gif after tables are ready
        addRemoveClass(compareButton, "remove", "loading-gif");
        
        // Remove class hidden from downlad section element so you can show the download button after tables are ready
        addRemoveClass(downloadSection, "remove", "hidden");

        // Set the session as completed
        sessionStatus.completed = true;

        // Click event on the download button that calls the function creating and downloading an excel file
        downloadButton.addEventListener("click", () => {
            downloadFile(resultObject);
        }, { once: true });
    }
}


const downloadFile = (resultObject) => {

    downloadButton.disabled = true;
    addRemoveClass(downloadButton, "add", "disabled");
    addRemoveClass(downloadButton, "add", "loading-gif");


    const optionsCsvFile = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultObject)
    }
    
    fetch("/createExcelFile", optionsCsvFile)
    .then(res => {
        if (res.status === 200) {
            downloadForm.submit();

            addRemoveClass(downloadButton, "remove", "loading-gif");
        }
    });
}

// On change event listener on the txt and csv inputs
txtFileInput.addEventListener("change", onTxtInputChange);
csvFileInput.addEventListener("change", onCsvInputChange);

// Click event on the "compare" button 
compareButton.addEventListener("click", () => {
    compareFilesInit();
});

// Click event on the "resetSession" button that triggers the resetSession function
document.querySelector(".execution-section__reset-button").addEventListener("click", () => {
    resetSession();
});