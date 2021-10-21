import { notificationWrapper } from "./variablesAndFlags.js";

// Show notification with the text of the notification set dynamically into the "p" element's data attribute and then added to its text content. 
export const showNotification = (attribute, text) => {
    const notificationText = notificationWrapper.querySelector(".notification-text");

    notificationText.setAttribute(attribute, text);
    
    notificationText.textContent = notificationText.getAttribute(attribute);
    
    notificationWrapper.classList.add("show-flex");

    setTimeout(() => {
        notificationWrapper.classList.remove("show-flex");
    }, 3000);
}

// Hide notification 
export const hideNotification = () => {
    notificationWrapper.classList.remove("show-flex");
}