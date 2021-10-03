// import express from "express";
// const { json } = require('body-parser');
const express = require('express')
const app = express();
const PORT = process.env.PORT || 4000;
// const router = express.Router();

const fs = require("fs");
const encodingConverter = require("iconv-lite");


// app.use("/", router);

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// app.use(express.static(__dirname));

app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`)
})


// let fileName;
let excelFileName;

const getDate = () => {
    let date = new Date();
    return {
        day: date.getDate(),
        month: date.getMonth()+1,
        year: date.getFullYear()
    }
}

const excel = require("excel4node");
const workBook = new excel.Workbook();

const missingInvoicesWorkSheet = workBook.addWorksheet("Missing Invoices");
const wrongVatNumberInvoicesWorkSheet = workBook.addWorksheet("Wrong VAT Number Invoices");

const style = workBook.createStyle({
    font: {
        color: "#000000",
        size: 12
    },
    // numberFormat: '$#,##0.00; ($#,##0.00); -',
})


const fillMIssingInvoicesInWorkSheet = (data) => {
    data.forEach((row, rowIndex) => {
        missingInvoicesWorkSheet.cell(rowIndex+1, 1)
        .style(style);

        row.forEach((cell, cellIndex) => {
            missingInvoicesWorkSheet.cell(rowIndex+1, cellIndex+1)
            .string(cell)
            .style(style);
        })
    })
}

fillWrongVatNumberInvoicesInWorkSheet = (data) => {
    data.forEach((row, rowIndex) => {
        wrongVatNumberInvoicesWorkSheet.cell(rowIndex+1, 1)
        .style(style);

        row.forEach((cell, cellIndex) => {
            wrongVatNumberInvoicesWorkSheet.cell(rowIndex+1, cellIndex+1)
            .string(cell)
            .style(style);
        })
    })
}

const createExcelFile = (req, res) => {
    const {day, month, year} = getDate();

    fillMIssingInvoicesInWorkSheet(req.body.concatenatedData);

    if (req.body.wrongVatNumberInvoices.length !== 0) {
        fillWrongVatNumberInvoicesInWorkSheet(req.body.wrongVatNumberInvoices);
    }
   

    excelFileName = `Results-${day}_${month}_${year}_${Date.now()}.xlsx`;

    workBook.write(
        `${excelFileName}`,
        (err) => {
            if (err) console.log("Wasn't able to create the excel file in workBook.write");
            
            console.log(`${excelFileName} was created succesfully.`)
    
            res.send();
        }
    );
}

const downloadExcelFile = (req, res) => {
    const excelFilePath = `${excelFileName}`;

    res.download(excelFilePath, (err) => {
        if (err) console.log("Wasn't anble to download the file in res.donwload in /downloadExcelFile route")

        console.log("File was downloaded")

        fs.unlink(excelFilePath, (error) => {
            if (error) console.log("Wasn't able to delete the file in fs.unlink in /downloadExcelFile route");

            console.log("file was deleted")
        })
        // res.end();
    })
}


app.post("/createCsvFile", (req, res) => {
    createExcelFile(req, res);
})

app.post("/downloadCsvFile", (req, res) => {
    downloadExcelFile(req, res);
})