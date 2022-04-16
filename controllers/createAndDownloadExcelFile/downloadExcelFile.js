const excelFile = require("./excelFile");
const fs = require("fs");

module.exports = (req, res) => {
    const excelFilePath = `${excelFile.name}`;

    res.download(excelFilePath, (err) => {
        if (err) console.log("Wasn't able to download the file in res.donwload in /downloadExcelFile route")

        console.log("File was downloaded")

        fs.unlink(excelFilePath, (error) => {
            if (error) console.log("Wasn't able to delete the file in fs.unlink in /downloadExcelFile route");

            console.log("file was deleted")
        })
    })
}