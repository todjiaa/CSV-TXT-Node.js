// Add the cell number of the "ID" for both the csv and txt file rows so the program can have it as a reference when comparing it both. 
export const csvFileIdCell = 5;
export const txtFileIdCell = 4;

// Add the cell number of the "VAT NUMBER" for both the csv and txt file rows so the program can have it as a reference when comparing it both. 
export const csvFileVatNumberCell = 1;
export const txtFileVatNumberCell = 5;

// Add the cell number of the "VAT VALUE" for both the csv and txt file rows so the program can have it as a reference when comparing it both. 
export const csvFileVatValueCell = 9;
export const txtFileVatValueCell = 10;

// Add the specific entry number generated in each txt row excluding the very fist number which will be generated here in the program.
export const txtIdEntryNumber = ["01", "03"]

export const txtListDescription = document.querySelector(".inputs-section__txt-list-description");
export const csvListDescription = document.querySelector(".inputs-section__csv-list-description");
export const txtFileInput = document.querySelector(".inputs-section__txt-input");
export const csvFileInput = document.querySelector(".inputs-section__csv-input");

export const fileNames = {
    txtFileNames: [],
    csvFileNames: []
}

export const files = {
    txtFilesArray: [],
    csvFilesArray: []
}

export const txtUl = document.querySelector(".inputs-section__txt-ul");
export const csvUl = document.querySelector(".inputs-section__csv-ul");

export let sessionStatus = {
    completed: false
};

export let comparisonStatus = {
    started: false,
    ended: false
};

export const compareButton = document.querySelector(".execution-section__compare-button");

export const logOutForm = document.querySelector(".header__logout-form");

export const tableSection = document.querySelector(".table-section"); 

export const notificationPlaceholder = document.querySelector(".notification-placeholder");
export const notificationDuration = 3000;

export const loginContainer = document.querySelector(".login-container");

export const downloadSection = document.querySelector(".download-section");
export const downloadForm = downloadSection.querySelector(".download-section__form");
export const downloadButton = downloadForm.querySelector(".download-section__button");