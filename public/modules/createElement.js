/**
 * Custom function for creating a DOM Element.
 * 
 * @param {object} object An object containing all the function parameters as properties.
 * @param {string} structural.tag An object property "tag". Expected input is the name of the html tag in a string format.
 * @param {HTMLElement} structural.parent An object property "parent". Expected input is any given HTML element that already exists in the DOM. 
 * @param {string} structural.insertMethod An object property "insertMethod". Expected input is the insertion method (append/prepend) in a string format. 
 * @param {object} attributes An object containing any given key/value pair attributes in string format.
 * @param {object} props An object containing any given DOM property.
 * @returns {HTMLElement} Returns the newly crated html element.
 */


export const createElement = ({structural, attributes, props}) => {
    const {
        tag,
        parent, 
        insertMethod
    } = structural;
    
    const element = document.createElement(tag);
    parent[insertMethod](element);

    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }

    for (let key in props) {
        element[key] = props[key];
    }

    return [element];
}