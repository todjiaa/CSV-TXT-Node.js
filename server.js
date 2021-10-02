// import express from "express";
// const { json } = require('body-parser');
const express = require('express')
const app = express();
const PORT = process.env.PORT || 4000;
// const router = express.Router();

const fs = require("fs");
const encodingConverter = require("iconv-lite");

const excel = require("excel4node");
const workBook = new excel.Workbook();

const workSheet = workBook.addWorksheet("Sheet 1");

const style = workBook.createStyle({
    font: {
        color: "#FF0800",
        size: 12
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -',
})


// app.use("/", router);

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// app.use(express.static(__dirname));

app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`)
})


let fileName;
let excelFileName;

const getDate = () => {
    let date = new Date();
    return {
        day: date.getDate(),
        month: date.getMonth()+1,
        year: date.getFullYear()
    }
}

const fillDataInWorkSheet = (data) => {
    workSheet.cell(1, 1)
    .string(data)
    .style(style);
}


const createExcelFile = (req, res) => {
    fillDataInWorkSheet(req.body[0]);

    excelFileName = "invoicesWithHeader.xlsx"

    workBook.write(
        `./temporaryFiles/${excelFileName}`,
        (err) => {
            if (err) console.log("Wasn't able to create the file in fs.writeFile");
            
            console.log(`${excelFileName} was created succesfully.`)
    
            res.send();
        }

    );
}

const downloadExcelFile = (req, res) => {
    const excelFilePath = `./temporaryFiles/${excelFileName}`;

    res.download(excelFilePath, (err) => {
        if (err) console.log("Wasn't anble to download the file in res.donwload in /downloadCsvFile foute")

        console.log("File was downloaded")

        fs.unlink(excelFilePath, (error) => {
            if (error) console.log("Wasn't able to delete the file in fs.unlink in /downloadCsvFile route");

            console.log("file was deleted")
        })
        // res.end();
    })
}

const createFile = (req, res) => {
    const {day, month, year} = getDate();

    fileName = `Missing invoices-${day}_${month}_${year}_${Date.now()}.csv`;

    const vatNumbersTitle = "Грешни номера на фактури:";

    // const title = req.body.splice(0, 1);

    const invoicesWithHeader = req.body.concatenatedData.map(row => {
        return row.join(";").split(",");
    })

    // invoicesWithHeader.push([])

    fs.writeFile(
        `./temporaryFiles/${fileName}`, 
        encodingConverter.encode(invoicesWithHeader.join('\r\n'), "windows-1251"), 
        (err) => {
        if (err) console.log("Wasn't able to create the file in fs.writeFile");
        
        console.log(`${fileName} was created succesfully.`)

        if (req.body.wrongVatNumbers.length === 0) {
            res.send();
            return
        }

        fs.appendFile(
            `./temporaryFiles/${fileName}`, 
            '\r\n\n\n', 
            (err) => {
            if (err) console.log("Wasn't able to create new line in fs.appendFile");
            
            console.log(`2 New Line was created succesfully.`)

            fs.appendFile(
                `./temporaryFiles/${fileName}`, 
                encodingConverter.encode(vatNumbersTitle + "\r\n", "windows-1251"), 
                (err) => {
                if (err) console.log(`Wasn't able to create ${vatNumbersTitle} in fs.appendFile`);
                
                console.log(`${vatNumbersTitle} was created succesfully.`)
        
                fs.appendFile(
                    `./temporaryFiles/${fileName}`, 
                    encodingConverter.encode(req.body.wrongVatNumbers.join('\r\n'), "windows-1251"), 
                    (err) => {
                    if (err) console.log("Wasn't able to create the wrong VAT numbers in fs.appendFile");
                    
                    console.log(`Wrong VAT numbers were created succesfully.`)
            
                    res.send();
                })
            })
        })
    })
}

const downloadFile = (req, res) => {
    const filePath = `./temporaryFiles/${fileName}`;

    res.download(filePath, (err) => {
        if (err) console.log("Wasn't anble to download the file in res.donwload in /downloadCsvFile foute")

        console.log("File was downloaded")

        fs.unlink(filePath, (error) => {
            if (error) console.log("Wasn't able to delete the file in fs.unlink in /downloadCsvFile route");

            console.log("file was deleted")
        })
        // res.end();
    })
}

app.post("/createCsvFile", (req, res) => {
    createFile(req, res);

    // createExcelFile(req, res);
})

app.post("/downloadCsvFile", (req, res) => {
    downloadFile(req, res);

    // downloadExcelFile(req, res);
})








// !!!!!! CODE THAT MIGHT BE USEFUL


// res.header({"Content-type": "multipart/form-data"})
    // res.sendFile(filePath)


    // fs.readFile(filePath, (err, data) => {
    //     if (err) {
    //         return next(err);
    //     }

    //     res.setHeader('Content-Disposition', 'attachment: filename="' + fileName + '"')
    //     res.setHeader("Content-Type", "application/download")
    //     res.send(data)
    // })

    // download(res)

    // Content-Disposition:attachment; filename="indicators.csv"
    // Content-Length:30125
    // Content-Type:text/csv; charset=UTF-8


    // Content-Type:application/octet-stream; charset=UTF-8

// const download = (res) => {
//     console.log('fileController.download: started')
//     // const path = req.body.path
//     const file = fs.createReadStream(filePath)
//     const filename = (new Date()).toISOString()
//     // res.setHeader('Content-Disposition', 'attachment: filename= fdfsf')
//     res.writeHead(200, {
//         "Content-type": "application/download",
//         "Content-Disposition": "attachment: filename = `hello`"
//     })
//     // res.setHeader("Content-Type", "application/download")

//     file.pipe(res)

// }

