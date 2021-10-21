const fs = require("fs");

module.exports = (fileName, data) => {
    fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
        if (err) console.log("Couldn't manage to write the file")
    });
}