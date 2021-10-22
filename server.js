// import express from "express";


// require("dotenv/config");

// require("dotenv").config();


const express = require('express');
const session = require("express-session");
const app = express();

const {
    SESSION_SECRET,
    SESSION_NAME,
    PORT
} = process.env

const serverPort = PORT || 4000;

const SESSION_LIFETIME = 1000 * 60 * 60 * 2;

const excel = require("excel4node");
const fs = require("fs");
// const encodingConverter = require("iconv-lite"); !!!!DELETE THIS DEPENDENCY AT THE END
require("pug");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcryptjs");

const insertDataToFile = require("./controllers/insertDataToFile");
const readFile = require("./controllers/readFile");

app.set("view-engine", "pug");

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static("public"));
app.use(session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // store: Set this option when using real database
    cookie: {
        maxAge: SESSION_LIFETIME,
        sameSite: true,
        // secure: true - Set this option only if the website is using https!
    }
}))


const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect("/login");
    } else {
        next()
    }
}

const redirectDashboard = (req, res, next) => {
    if (req.session.userId) {
        res.redirect("/dashboard");
    } else {
        next()
    }
}

app.get("/", redirectDashboard, (req, res) => {
    res.redirect("/login");
})

app.get("/login", redirectDashboard, (req, res) => {
    res.render("login.pug");

    app.locals.succesfullRegistration = "";
    app.locals.statusMessage = "";
    app.locals.userStatus = "";
})

app.get("/register", redirectDashboard, (req, res) => {
    res.render("register.pug");

    app.locals.statusMessage = "";
})

app.get("/dashboard", redirectLogin, (req, res) => {
    res.render("dashboard.pug");
})

app.post("/register", (req, res) => {
    readFile("./users.json", "utf-8", async (data) => {
        try {
            const hashedPass = await bcrypt.hash(req.body.password, 10)
    
            const newUserCredentials = {
                id: uuidv4(),
                name: req.body.name,
                email: req.body.email,
                password: hashedPass
            }
    
            if (!data) {
                console.log("Not existing users in database, adding the first one");
    
                insertDataToFile("./users.json", newUserCredentials);
    
                app.locals.succesfullRegistration = "You have registered succesfully! Please Log in.";
    
                return res.redirect("/login");
            }
            const usersDataBase = JSON.parse(data)
            
            const newUser = usersDataBase.some(user => {
                return user.email === req.body.email
            })
    
            if (newUser) {
                console.log("This user already exists")

                app.locals.statusMessage = "This user already exists."
    
                res.redirect("/register");
            }
            else {
                insertDataToFile("./users.json", newUserCredentials);
    
                console.log("Just added a new user")
    
                app.locals.succesfullRegistration = "You have registered succesfully! Please Log in.";
    
                res.redirect("/login");
            }
        } catch {
            console.log("Something went wrong registering you.");

            app.locals.statusMessage = "Something went wrong, please try again.";

            res.redirect("/register");
        }
    })
})

app.post("/login", (req, res) => {
    readFile("./users.json", "utf-8", async (data) => {
        if (!data) {
            console.log("Data base is empty")

            app.locals.userStatus = "This user doesn't exist. Sign up please!";

            return res.redirect("/login");
        }
        const usersDataBase = JSON.parse(data);
        
        const logingUser = usersDataBase.find(user => {
            return user.email === req.body.email
        })

        try {
            const isPasswordMatched = await bcrypt.compare(req.body.password, logingUser.password)
    
            if (logingUser && isPasswordMatched) {
                req.session.userId = logingUser.id;
    
                app.locals.name = logingUser.name;
    
                res.redirect("/dashboard");
            }
            else {
                console.log("Wrong credentials")

                app.locals.userStatus = "Wrong user name or password.";
    
                res.redirect("/login")
            }
        } catch {
            console.log("Catched")

            app.locals.userStatus = "Wrong user name or password.";

            res.redirect("/login")
        }
    })
})

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.redirect("/dashboard");
        }
    })

    res.clearCookie(SESSION_NAME);

    res.redirect("/login");
})










let excelFileName;

const getDate = () => {
    let date = new Date();
    return {
        day: date.getDate(),
        month: date.getMonth()+1,
        year: date.getFullYear()
    }
}

const fillMIssingInvoicesInWorkSheet = (data, missingInvoicesWorkSheet, style) => {
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

fillWrongVatNumberInvoicesInWorkSheet = (data, wrongVatNumberInvoicesWorkSheet, style) => {
    data.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            wrongVatNumberInvoicesWorkSheet.cell(rowIndex+1, cellIndex+1)
            .string(cell)
            .style(style);
        })
    })
}

const createExcelFile = (req, res) => {
    const {day, month, year} = getDate();

    excelFileName = `Results-${day}_${month}_${year}_${Date.now()}.xlsx`;

    const workBook = new excel.Workbook();

    const style = workBook.createStyle({
        font: {
            color: "#000000",
            size: 12
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    })

    const missingInvoicesWorkSheet = workBook.addWorksheet("Missing Invoices");

    fillMIssingInvoicesInWorkSheet(req.body.concatenatedData, missingInvoicesWorkSheet, style);

    if (req.body.wrongVatNumberInvoices.length !== 0) {
        const wrongVatNumberInvoicesWorkSheet = workBook.addWorksheet("Wrong VAT Number Invoices");
        fillWrongVatNumberInvoicesInWorkSheet(req.body.wrongVatNumberInvoices, wrongVatNumberInvoicesWorkSheet, style);
    }

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
    })
}



app.post("/createCsvFile", (req, res) => {
    createExcelFile(req, res);
})

app.post("/downloadCsvFile", (req, res) => {
    downloadExcelFile(req, res);
})


app.listen(serverPort, () => {
    console.log(`Server is running at port: ${serverPort}`)
})