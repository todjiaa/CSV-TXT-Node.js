const fs = require("fs");

module.exports = (fileName, encoding, callback) => {
    fs.readFile(fileName, encoding, (err, receivedData) => {
        if (err) console.log("Error in reading file content");
        
        callback(receivedData)
    })
}