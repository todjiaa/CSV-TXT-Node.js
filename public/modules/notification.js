import { addRemoveClass } from "./addRemoveClass.js";
import { createElement } from "./createElement.js";
import { notificationPlaceholder } from "./variablesAndFlags.js";

// Create the notification pop up dynamically  
export const createNotification = () => {
    // Notification container
    const [notificationContainer] = createElement({
        structural: {
            tag: "div",
            parent: notificationPlaceholder,
            insertMethod: "prepend"
        },
        attributes: {
            class: "notification-placeholder__notification-container"
        }
    })

    // Message container
    const [notificationMessageContainer] = createElement({
        structural: {
            tag: "div",
            parent: notificationContainer,
            insertMethod: "append"
        },
        attributes: {
            class: "notification-placeholder__message-container"
        }
    })

    // Message
    const [messageElement] = createElement({
        structural: {
            tag: "p",
            parent: notificationMessageContainer,
            insertMethod: "append"
        },
        attributes: {
            class: "notification-placeholder__message"
        },
    })

    // Close button container
    const [closeButtonContainer] =  createElement({
        structural: {
            tag: "div",
            parent: notificationContainer,
            insertMethod: "append"
        },
        attributes: {
            class: "notification-placeholder__close-button-container"
        }
    })

    // Close button
    createElement({
        structural: {
            tag: "span",
            parent: closeButtonContainer,
            insertMethod: "append"
        },
        attributes: {
            class: "notification-placeholder__close-button"
        },
        props: {
            textContent: "x"
        }
    })
    return [messageElement, closeButtonContainer, notificationContainer];
}

// Close the notification 
export const closeNotification = (e) => {
    // Get the closest notification container to the element the user has clicked on
    const closest = e.target.closest(".notification-placeholder__notification-container");
    
    // Add animation for removing the notification
    addRemoveClass(closest, "add", "slide-out");
    
    // After the animation is finished, remove the notification element
    closest.addEventListener("animationend", () => {
        closest.remove()
    }, { once: true })
}


// Close All notifications
export const closeAllNotifications = () => {
    // Get all currently active notifications
    const notificationsArray = [...document.querySelectorAll(".notification-placeholder__notification-container")];

    notificationsArray.forEach((notification, notificIndex) => {
        // Close notifications one after each other based on the index of each notification
        setTimeout(() => {
            // Add animation for removing the notification
            addRemoveClass(notification, "add", "slide-out");

            // After the animation is finished, remove the notification element
            notification.addEventListener("animationend", () => {
                notification.remove();
            }, { once: true })

        }, notificIndex * 200)
    });
}

// Show notification with the text of the notification set dynamically into the "p" element's data attribute (messageElement) and then added to its text content. 
export const showNotification = (attribute, message, duration = 2000) => {
    const [messageElement, closeButtonContainer, notificationContainer] = createNotification();

    // Add animation when showing the notification
    addRemoveClass(notificationContainer, "add", "slide-in");

    messageElement.setAttribute(attribute, message);
    
    messageElement.textContent = messageElement.getAttribute(attribute);
    
    // Set expiry time of the notification so it closes automatically 
    setTimeout(() => {
        // Add animation for removing the notification
        addRemoveClass(notificationContainer, "add", "slide-out");
        
        // After the animation is finished, remove the notification element
        notificationContainer.addEventListener("animationend", () => {
            notificationContainer.remove();
        }, { once: true })
    }, duration);

    // Add an event listener for the click on the "X" in the notification container
    closeButtonContainer.addEventListener("click", closeNotification, { once: true });
}