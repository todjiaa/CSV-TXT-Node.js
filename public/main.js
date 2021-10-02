import { compareFiles } from "./modules/compareFiles.js";
import { separateMissingInvoicesByFile } from "./modules/separateMissingInvoicesByFile.js";
import { hideNotification } from "./modules/showHideNotification.js";
import { onTxtInputChange, onCsvInputChange } from "./modules/onInputChange.js";
import { resetSession } from "./modules/resetSession.js";
import { sortTheData } from "./modules/sortTheData.js";
import {
    loadingGifWrapper,
    txtFileInput,
    csvFileInput, 
    sessionStatus, 
    txtUl, 
    csvUl, 
    files,
    downloadWrapper,
    downloadForm,
    downloadButton
} from "./modules/variablesAndFlags.js";


// Init the whole algorithm of comparing both csv and txt files
const findMissingInvoicesInCsvFile = () => {
    if (!sessionStatus.completed && txtUl.childElementCount !== 0 && csvUl.childElementCount !== 0) {
        loadingGifWrapper.classList.add("show-block");

        const txtArray = [].concat.apply([], files.txtFilesArray);
        const csvArray = [].concat.apply([], files.csvFilesArray);

        const [missingInvoices, wrongVatNumbers] = compareFiles(csvArray, txtArray);

        const [filesArray] = separateMissingInvoicesByFile(missingInvoices);

        const [sortedData] = sortTheData(filesArray, wrongVatNumbers);       
        
        downloadWrapper.classList.add("show-flex");
        
        loadingGifWrapper.classList.remove("show-block");
        
        sessionStatus.completed = true;

        downloadButton.addEventListener("click", function handler() {
            createFile(sortedData, wrongVatNumbers);

            downloadButton.removeEventListener("click", handler);
        });
    }
}


const createFile = (sortedData, wrongVatNumbers) => {
    const concatenatedData = [].concat.apply([], sortedData);

    const optionsCsvFile = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                concatenatedData: concatenatedData,
                wrongVatNumbers: wrongVatNumbers
            }
        )
    }
    
    fetch("/createCsvFile", optionsCsvFile)
    .then(res => {
        if (res.status === 200) {
            // downloadForm.submit()

            downloadButton.disabled = true;
        }
    });
}






// On change event listener on the txt and csv inputs
txtFileInput.addEventListener("change", onTxtInputChange);
csvFileInput.addEventListener("change", onCsvInputChange);

// Click event on the "find missing" button that triggers the main function initializing everything 
document.querySelector(".find-missing-button").addEventListener("click", () => {
    findMissingInvoicesInCsvFile();
});

// Click event on the "resetSession" button that triggers the resetSession session function
document.querySelector(".reset-button").addEventListener("click", () => {
    resetSession();
});

// Click event on the "X" span of the notification that triggers the function closing the resetSession notification 
document.querySelector(".close-notification-wrapper").addEventListener("click", hideNotification);

// document.querySelector(".login-button").addEventListener("click", login);

// document.querySelector(".registration-button").addEventListener("click", registration);










// !!!!! CODE THAT MIGHT BE USEFUL


// const xml = new XMLHttpRequest();

// const optionsGetCsvFile = {
//     method: "POST",
//     // mode: 'no-cors', // no-cors, *cors, same-origin,
//     // headers: {
//     //     'Content-Type': 'multipart/form-data',
//     // },
//     // body: JSON.stringify(final)
// }

// const getCsvFile = () => {
//     // fetch("/getCsvFile", optionsGetCsvFile)
//     // // .then(response => response.json())
//     // // .then(data => data.text())

//     // .then(result => console.log(result))

//     // $.ajax({
//     //     url: '/getCsvFile',
//     //     type: 'POST',
//     //     success: function() {
//     //         window.location = 'download.php';
//     //     }
//     // });

// }




// // const toma = {
// //     name: "Toma",
// //     age: 36,
// //     designation: "Sound-engineer"
// // }

// // const dimana = {
// //     name: "Dimana",
// //     age: 37,
// //     designation: "Artist"
// // }


// // const optionsUsers = {
// //     method: "POST",
// //     // mode: 'no-cors', // no-cors, *cors, same-origin,
// //     headers: {
// //         'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify(toma)
// // }

// // const responseUsers = fetch("/users", optionsUsers)
// // .then(response => response.json())
// // .then(data => console.log(data))

// // console.log(responseUsers)