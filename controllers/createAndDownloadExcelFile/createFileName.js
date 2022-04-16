const excelFile = require("./excelFile");
const getDate = require("./getDate");

module.exports = () => {
    const {day, month, year} = getDate();

    excelFile.name = `Results-${day}_${month}_${year}_${Date.now()}.xlsx`;
}