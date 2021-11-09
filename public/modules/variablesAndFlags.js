export const txtFileIdCellNumber = 4;
export const csvFileIdCellNumber = 5;

export const txtFileInput = document.querySelector(".txt-input");
export const csvFileInput = document.querySelector(".csv-input");

export const fileNames = {
    txtFileNames: [],
    csvFileNames: []
}

export const files = {
    txtFilesArray: [],
    csvFilesArray: []
}

export const txtUl = document.querySelector(".txt-ul");
export const csvUl = document.querySelector(".csv-ul");

export let sessionStatus = {
    completed: false
};

export const logOutForm = document.querySelector(".header_logout-form");

export const missingInvoicesWrapper = document.querySelector(".missing-invoices-wrapper"); 

export const notificationWrapper = document.querySelector(".notification-wrapper");

export const loadingGifWrapper = document.querySelector(".loading-gif-wrapper");

export const loginContainer = document.querySelector(".login-container");

export const downloadWrapper = document.querySelector(".download-wrapper");
export const downloadForm = downloadWrapper.querySelector(".download-form");
export const downloadButton = downloadForm.querySelector(".download-button");

export const sessionWrapper = document.querySelector(".session-wrapper");
export const sessionWrapperH2 = sessionWrapper.querySelector(".session-wrapper_h2");
export const sessionWrapperExtendButton = sessionWrapper.querySelector(".session-wrapper_extend-button");
export const sessionWrapperForm = sessionWrapper.querySelector(".session-wrapper_form");

