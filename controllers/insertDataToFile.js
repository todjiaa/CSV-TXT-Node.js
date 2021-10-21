const readFile = require("./readFile");
const writeFile = require("./writeFile");

module.exports = (fileName, insertedData) => {
    readFile(fileName, "utf-8", (receivedData) => {
        if (receivedData) {
            const parsed = JSON.parse(receivedData);
    
            parsed.push(insertedData);
    
            writeFile(fileName, parsed);
            
        } else {
            writeFile(fileName, [insertedData]);
        }
    })
}