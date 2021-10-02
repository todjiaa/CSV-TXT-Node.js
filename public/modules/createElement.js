// Standard function for creating a DOM Element
export const createElement = (options) => {
    const {
        tagName,
        parent,
        className,
        attributeName,
        attributeValue,
        value,
        innerText,
        innerHTML,
        type,
        action,
        method
    } = options;
    
    const element = document.createElement(tagName);
    parent.append(element);

    element.classList.add(className);
    element.value = value;
    if (attributeName) element.setAttribute(attributeName, attributeValue);
    if (options.innerText) element.innerText = innerText;
    if (options.innerHTML) element.innerHTML = innerHTML;
    element.type = type;
    element.action = action;
    element.method = method;

    // console.log(element.atributes)

    return [element];
}





// export const createElement = (tagName, parent, className, innerText, type, action, value, method) => {
    //     const element = document.createElement(tagName);
    
    //     if (parent) parent.append(element);
    //     if (className) element.classList.add(className);
    //     if (innerText) element.innerText = innerText;
    
    
    //     if (type) element.type = type;
    //     if (action) element.action = action;
    //     if (value) element.value = value;
    //     if (method) element.method = method;
    
    
    //     return [element];
    // }