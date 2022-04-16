const excel = require("excel4node");
const createFileName = require("./createFileName");
const excelFile = require("./excelFile");
const excelSheetStyleOptions = require("./excelSheetStyleOptions");
const extractData = require("./extractData");

module.exports = (req, res) => {
    createFileName();

    const workBook = new excel.Workbook();

    const style = workBook.createStyle(excelSheetStyleOptions);

    extractData(req.body, workBook, style);

    workBook.write(
        `${excelFile.name}`,
        (err) => {
            if (err) console.log("Wasn't able to create the excel file in workBook.write");
            
            console.log(`${excelFile.name} was created succesfully.`)
    
            res.send();
        }
    );
}