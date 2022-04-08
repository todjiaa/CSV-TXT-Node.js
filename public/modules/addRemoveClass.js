export const addRemoveClass = (element, action, className) => {
    element.classList[action](className);
}