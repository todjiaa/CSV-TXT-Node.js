// LIBRARIES 
const express = require('express');
const session = require("express-session");
const mysql = require("mysql");
const MySqlStore = require("express-mysql-session")(session);
const excel = require("excel4node");
const fs = require("fs");
require("pug");

// CONTROLERS 
const notificationInit = require('./controllers/notificationInit');
const register = require('./controllers/loginAndRegistration/register');
const login = require('./controllers/loginAndRegistration/login');
const logOut = require("./controllers/loginAndRegistration/logOut");

// MIDDLEWARE
const redirectLogin = require('./controllers/loginAndRegistration/middleWare/redirectLogin');
const redirectDashboard = require('./controllers/loginAndRegistration/middleWare/redirectDashboard');

// ENVIREMENT VARIABLES
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

// APP INITIAL SET UP
const app = express();
app.set("view-engine", "pug");
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static("public"));
const SERVER_PORT = PORT || 4000;


// CONFIGURE DATA BASE POOL
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
// INIT DATA BASE POOL
const dbPool = mysql.createPool(dbPoolConfig);

// SESSION STORE OPTIONS
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

// INIT SESSION STORE 
const sessionStore = new MySqlStore(sessionStoreOptions);

// CREATE SESSION ON FIRST RESPONSE 
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




// GET REQUESTS
app.get("/", redirectDashboard, (req, res) => {
    res.redirect("/login");
})

app.get("/login", redirectDashboard, (req, res) => {
    res.render("login.pug");

    notificationInit(app, "loginNotification", "");
    // notificationInit(app, "registrationNotification", "");
})

app.get("/register", redirectDashboard, (req, res) => {
    res.render("register.pug");

    notificationInit(app, "registrationNotification", "");
})

app.get("/dashboard", redirectLogin, (req, res) => {
    res.locals.name = req.session.userName;

    res.render("dashboard.pug");
})


// POST REQUESTS
app.post("/register", (req, res) => {
    register(req, res, app, dbPool);
})

app.post("/login", (req, res) => {
    login(req, res, app, dbPool);
})

app.post("/logout", (req, res) => {
    logOut(req, res, sessionStore);
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

const createWorksheetName = (workBook, obj) => {
    return [workBook.addWorksheet(`${obj.category} в ${obj.fileName}`)] 
}

const extractData = (data, workBook, style) => {
    data.forEach(file => {
        file.forEach(obj => {
            if (obj.invoices.length === 0) return

            const [workSheetName] = createWorksheetName(workBook, obj)

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
        if (err) console.log("Wasn't able to download the file in res.donwload in /downloadExcelFile route")

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




















// // INSERT USERS TO DB
// const insertUserToDB = (newUser, callback) => {
//     const insertIntoUsers = `INSERT INTO users Set ?`;

//     dbPool.query(insertIntoUsers, newUser, (insertError, result) => {
//         if (insertError) {
//             console.log("There was an error inserting the user in the DB");
            
//             return callback(insertError);
//         }
//         callback(insertError, result);
//     })
// }

// // GET USERS FROM DB
// const getUsersFromDB = (callback) => {
//     const selectAllUsers = `SELECT * FROM users`;

//     dbPool.getConnection((connectionError, connection) => {
//         if (connectionError) {
//             console.log("Didn't manage to connect to Data Base", connectionError.code);
            
//             return callback(connectionError);
//         } 

//         console.log("Data Base Connected");

//         connection.query(selectAllUsers, (retrivingError, users) => {
//             if (retrivingError) {
//                 console.log("There was an error retriving the users from the DB", retrivingError.code);
                
//                 return callback(connectionError, retrivingError);
//             }

//             console.log("Users retrieved");
            
//             callback(connectionError, retrivingError, users);

//             connection.release();
//         })
//     })
// }

// app.post("/register", (req, res) => {
//     getUsersFromDB(async (connectionError, retrivingError, users) => {
//         if (connectionError) {
//             registrationNotification(app, "Something went wrong connecting to the Server. Please try to register again.")

//             return res.redirect("/register");
//         }

//         if (retrivingError) {
//             registrationNotification(app, "Something went wrong. Please try to register again.")

//             return res.redirect("/register");
//         }

//         try {
//             const hashedPass = await bcrypt.hash(req.body.password, 10)
            
//             const newUserCredentials = {
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: hashedPass
//             }
            
//             // if (!users) {
//             //     console.log("Not existing users in database, adding the first one");
    
//             //     if (insertError) {
//             //         registrationNotification(app, "Something went wrong registering you. Please try again.")

//             //         return res.redirect("/register");
//             //     }

//             //     console.log("New user added succesfully!")
                
//             //     loginNotification(app, "You have registered succesfully! Please Log in.")
                
//             //     res.redirect("/login");
//             // }

//             const existingUser = users.some(user => {
//                 return user.email === req.body.email
//             })

//             if (existingUser) {
//                 console.log("This user already exists")

//                 registrationNotification(app, "This user already exists.")

//                 res.redirect("/register");
//             }
//             else {
//                 insertUserToDB(newUserCredentials, (insertError) => {
//                     if (insertError) {
//                         registrationNotification(app, "Something went wrong registering you. Please try again.")

//                         return res.redirect("/register");
//                     }

//                     console.log("New user added succesfully!")
                    
//                     loginNotification(app, "You have registered succesfully! Please Log in.")
                    
//                     res.redirect("/login");
//                 });
//             }
//         } catch {
//             console.log("Catched Error. Something went wrong registering you.");

//             registrationNotification(app, "Something went wrong, please try again.");

//             res.redirect("/register");
//         }
//     })
// })

// app.post("/login", (req, res) => {
//     getUsersFromDB(async (connectionError, retrivingError, users) => {
//         if (connectionError) {
//             loginNotification(app, "Something went wrong connecting to the Server. Please try to log in again.")

//             return res.redirect("/login");
//         }

//         if (retrivingError) {
//             loginNotification(app, "Something went wrong. Please try to log in again.")

//             return res.redirect("/login");
//         }

//         if (!users) {
//             console.log("Data base is empty")

//             loginNotification(app, "This user doesn't exist. Sign up please!")

//             return res.redirect("/login");
//         }
//         const logingUser = users.find(user => {
//             return user.email === req.body.email
//         })

//         if (!logingUser) {
//             console.log("User doesn't exist")

//             loginNotification(app, "User doesn't exist. Please register first.")

//             return res.redirect("/login")
//         }

//         try {
//             const isPasswordMatched = await bcrypt.compare(req.body.password, logingUser.password);

//             if (logingUser && isPasswordMatched) {
//                 req.session.userId = logingUser.id;
    
//                 req.session.userName = logingUser.name;
    
//                 res.redirect("/dashboard");
//             }
//             else {
//                 console.log("Wrong credentials")

//                 loginNotification(app, "Wrong user name or password.")

//                 res.redirect("/login")
//             }
//         } catch {
//             console.log("Catched")

//             loginNotification(app, "Wrong user name or password.")

//             res.redirect("/login")
//         }
//     })
// })
























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