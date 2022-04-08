const express = require('express');
const session = require("express-session");
const app = express();
const mysql = require("mysql");
const MySqlStore = require("express-mysql-session")(session);

const {
    PORT,
    SESSION_SECRET,
    SESSION_NAME,
    // SESSION_LIFETIME,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USER,
    DATABASE_PASSWORD,
} = process.env

const SERVER_PORT = PORT || 4000;

const excel = require("excel4node");
const fs = require("fs");
require("pug");
const bcrypt = require("bcryptjs");
const logOut = require("./controllers/logOut");
const loginNotification = require("./controllers/loginNotification");
const registrationNotification = require("./controllers/registrationNotification");


app.set("view-engine", "pug");

const dbPoolConfig = {
    host: DATABASE_HOST,
    // host: "",
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: "sql11446093",
    // waitForConnections: true,
    port: parseInt(DATABASE_PORT),
    connectionLimit: 100,
    // queueLimit: 0
}
const dbPool = mysql.createPool(dbPoolConfig)

const sessionStoreOptions = {
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: "sql11446093",
    port: parseInt(DATABASE_PORT),
    createDatabaseTable: true,
    // clearExpired: true,
    // checkExpirationInterval: parseInt(SESSION_LIFETIME),
    connectionLimit: 100,
    schema: {
        tableName: "sessions",
        columnNames: {
            session_id: "session_id",
            expires: "expires",
            data: "data"
        }
    }
}

const sessionStore = new MySqlStore(sessionStoreOptions);

const insertUserToDB = (newUser, callback) => {
    const sql = `INSERT INTO users Set ?`;

    dbPool.query(sql, newUser, (insertError, result) => {
        if (insertError) {
            console.log("There was an error inserting the user in the DB");
            
            return callback(insertError);
        }
        callback(insertError, result);
    })
}

const getUsersFromDB = (callback) => {
    const sql = `SELECT * FROM users`;

    dbPool.getConnection((connectionError, connection) => {
        if (connectionError) {
            console.log("Didn't manage to connect to Data Base", connectionError.code)
            
            return callback(connectionError);
        } 

        connection.query(sql, (retrivingError, users) => {
            if (retrivingError) {
                console.log("There was an error retriving the users from the DB", retrivingError.code)
                
                return callback(connectionError, retrivingError);
            }

            console.log("Users retrieved")
            
            callback(connectionError, retrivingError, users);

            connection.release();
        })
    })
}

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static("public"));


app.use(session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: true, // It will resave the session in the database store
    saveUninitialized: false,
    store: sessionStore,
    rolling: false, // It will reinitialize the cookie max age to original lifetime on each response
    cookie: {
        path: "/",
        // maxAge: parseInt(SESSION_LIFETIME),
        sameSite: true,
        // secure: true - This option will set a cookie only if the website is using https!
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
    if (req.session && req.session.userId) {
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

    loginNotification(app, "");
    registrationNotification(app, "");
})

app.get("/register", redirectDashboard, (req, res) => {
    res.render("register.pug");

    registrationNotification(app, "");
})

app.get("/dashboard", redirectLogin, (req, res) => {
    res.locals.name = req.session.userName;

    res.render("dashboard.pug");
})



app.post("/register", (req, res) => {
    getUsersFromDB(async (connectionError, retrivingError, users) => {
        if (connectionError) {
            registrationNotification(app, "Something went wrong connecting to the Server. Please try to register again.")

            return res.redirect("/register");
        }

        if (retrivingError) {
            registrationNotification(app, "Something went wrong. Please try to register again.")

            return res.redirect("/register");
        }
        try {
            const hashedPass = await bcrypt.hash(req.body.password, 10)
            
            const newUserCredentials = {
                name: req.body.name,
                email: req.body.email,
                password: hashedPass
            }
            
            if (!users) {
                console.log("Not existing users in database, adding the first one");
    
                if (insertError) {
                    registrationNotification(app, "Something went wrong registering you. Please try again.")

                    return res.redirect("/register");
                }

                console.log("New user added succesfully!")
                
                loginNotification(app, "You have registered succesfully! Please Log in.")
                
                res.redirect("/login");
            }

            const existingUser = users.some(user => {
                return user.email === req.body.email
            })

            if (existingUser) {
                console.log("This user already exists")

                registrationNotification(app, "This user already exists.")

                res.redirect("/register");
            }
            else {
                insertUserToDB(newUserCredentials, (insertError) => {
                    if (insertError) {
                        registrationNotification(app, "Something went wrong registering you. Please try again.")

                        return res.redirect("/register");
                    }

                    console.log("New user added succesfully!")
                    
                    loginNotification(app, "You have registered succesfully! Please Log in.")
                    
                    res.redirect("/login");
                });
            }
        } catch {
            console.log("Something went wrong registering you.");

            registrationNotification(app, "Something went wrong, please try again.")
            res.redirect("/register");
        }
    })
})

app.post("/login", (req, res) => {
    getUsersFromDB(async (connectionError, retrivingError, users) => {
        if (connectionError) {
            loginNotification(app, "Something went wrong connecting to the Server. Please try to log in again.")

            return res.redirect("/login");
        }

        if (retrivingError) {
            loginNotification(app, "Something went wrong. Please try to log in again.")

            return res.redirect("/login");
        }

        if (!users) {
            console.log("Data base is empty")

            loginNotification(app, "This user doesn't exist. Sign up please!")

            return res.redirect("/login");
        }
        const logingUser = users.find(user => {
            return user.email === req.body.email
        })

        if (!logingUser) {
            console.log("User doesn't exist")

            loginNotification(app, "User doesn't exist. Please register first.")

            return res.redirect("/login")
        }

        try {
            const isPasswordMatched = await bcrypt.compare(req.body.password, logingUser.password);

            if (logingUser && isPasswordMatched) {
                req.session.userId = logingUser.id;
    
                req.session.userName = logingUser.name;
    
                res.redirect("/dashboard");
            }
            else {
                console.log("Wrong credentials")

                loginNotification(app, "Wrong user name or password.")

                res.redirect("/login")
            }
        } catch {
            console.log("Catched")

            loginNotification(app, "Wrong user name or password.")

            res.redirect("/login")
        }
    })
})

app.post("/logout", (req, res) => {
    logOut(req, res, sessionStore)
})













let excelFileName;

const excelSheetStyleOptions = {
    alignment: {
        vertical: "center",
    },
    font: {
        color: "#000000",
        size: 12
    },
    border: {
        left: {
            style: "thin",
            color: "#FF0000"
        },
        right: {
            style: "thin",
            color: "#FF0000"
        },
        top: {
            style: "thin",
            color: "#FF0000"
        },
        bottom: {
            style: "thin",
            color: "#FF0000"
        },
    },
    fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#00ffbb"
    },
   
    // numberFormat: '$#,##0.00; ($#,##0.00); -',
}

const getDate = () => {
    let date = new Date();
    return {
        day: date.getDate(),
        month: date.getMonth()+1,
        year: date.getFullYear()
    }
}

const fillWorkSheet = (workSheet, rowIndex, columnIndex, data, style) => {
    workSheet.cell(rowIndex+1, columnIndex+1)
    .string(data)
    .style(style);
}

const setExcelSheetColumnWidth = (workSheet, rowIndex, columnIndex, data) => {
    if (rowIndex < 1) {
        workSheet.column(columnIndex+1).setWidth(data.length);
    }
}


const createFileName = () => {
    const {day, month, year} = getDate();

    excelFileName = `Results-${day}_${month}_${year}_${Date.now()}.xlsx`;
}

const extractData = (data, workBook, style) => {
    data.forEach(file => {
        file.forEach(obj => {
            if (obj.invoices.length === 0) return

            const workSheetName = workBook.addWorksheet(`Missing Invoices in ${obj.fileName}`);

            obj.invoices.forEach((rowData, rowIndex) => {
                rowData.forEach((cellData, cellIndex) => {
                    fillWorkSheet(workSheetName, rowIndex, cellIndex, cellData, style);

                    setExcelSheetColumnWidth(workSheetName, rowIndex, cellIndex, cellData);
                })
            })

        })
    })
}


const createExcelFile = (req, res) => {
    createFileName();

    const workBook = new excel.Workbook();

    const style = workBook.createStyle(excelSheetStyleOptions)

    extractData(req.body, workBook, style)


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

app.post("/createExcelFile", (req, res) => {
    createExcelFile(req, res);
})

app.post("/downloadExcelFile", (req, res) => {
    downloadExcelFile(req, res);
})

app.listen(SERVER_PORT, () => {
    console.log(`Server is running at port: ${SERVER_PORT}`)
})

















// req.body.concatenatedData.forEach(file => {
        
    //     const missingInvoicesWorkSheet = workBook.addWorksheet(`Missing Invoices in ${file[1][file[0].length-1]}`);

    //     file.forEach((row, rowIndex) => {
    //         row.forEach((cell, cellIndex) => {
    //             missingInvoicesWorkSheet.cell(rowIndex+1, cellIndex+1)
    //             .string(cell)
    //             .style(style)
    //         })
    //     })

    //     fillMIssingInvoicesInWorkSheet(file, missingInvoicesWorkSheet, style);

    //     setColumnWidth(file, missingInvoicesWorkSheet);
    // })

    // req.body.concatenatedData.forEach(file => {
    //     const missingInvoicesWorkSheet = workBook.addWorksheet(`Missing Invoices in ${file[1][file[0].length-1]}`);

    //     fillMIssingInvoicesInWorkSheet(file, missingInvoicesWorkSheet, style);

    //     setColumnWidth(file, missingInvoicesWorkSheet);
    // })


    // if (req.body.wrongVatNumberInvoices.length !== 0) {
    //     const wrongVatNumberInvoicesWorkSheet = workBook.addWorksheet("Wrong VAT Number Invoices");
    //     fillWrongVatNumberInvoicesInWorkSheet(req.body.wrongVatNumberInvoices, wrongVatNumberInvoicesWorkSheet, style);
    // }



// const fillMIssingInvoicesInWorkSheet = (data, missingInvoicesWorkSheet, style) => {
//     data.forEach((row, rowIndex) => {
//         row.forEach((cell, cellIndex) => {
//             missingInvoicesWorkSheet.cell(rowIndex+1, cellIndex+1)
//             .string(cell)
//             .style(style)
//         })
//     })
// }

// fillWrongVatNumberInvoicesInWorkSheet = (data, wrongVatNumberInvoicesWorkSheet, style) => {
//     data.forEach((row, rowIndex) => {
//         row.forEach((cell, cellIndex) => {
//             wrongVatNumberInvoicesWorkSheet.cell(rowIndex+1, cellIndex+1)
//             .string(cell)
//             .style(style);
//         })
//     })
// }