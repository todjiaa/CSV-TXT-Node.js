const express = require('express');
const session = require("express-session");
const app = express();
const mysql = require("mysql");
const MySqlStore = require("express-mysql-session")(session);

const {
    PORT,
    SESSION_SECRET,
    SESSION_NAME,
    SESSION_LIFETIME,
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


app.set("view-engine", "pug");

const dbPoolConfig = {
    host: DATABASE_HOST,
    // host: "",
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: "sql11446093",
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
    clearExpired: true,
    checkExpirationInterval: parseInt(SESSION_LIFETIME),
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

const hour = 3600000


app.use(session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false, // It will resave the session in the database store
    saveUninitialized: false,
    store: sessionStore,
    rolling: false, // It will reinitialize the cookie max age on each user action
    cookie: {
        maxAge: parseInt(SESSION_LIFETIME),
        sameSite: true,
        // secure: true - This option will set a cookie only if the website is using https!
    }
}), (req, res, next) => {
    if(req.path === "/dashboard") {
        // req.session.cookie.maxAge = parseInt(SESSION_LIFETIME)

        // req.session.test = Date.now()


        // console.log("in middleWare age", req.session.cookie.maxAge)
        
        // console.log("in middleWare path", req.path)
        
    }
    next()
})



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

    // console.log("in login", req.session.cookie.maxAge)

    res.render("login.pug");

    // app.locals.succesfullRegistration = "";
    // app.locals.statusMessage = "";
    // app.locals.userStatus = "";
    app.locals.loginStatusMessage = "";
    app.locals.registrationStatusMessage = "";
})

app.get("/register", redirectDashboard, (req, res) => {
    res.render("register.pug");

    app.locals.registrationStatusMessage = "";
})


app.get("/dashboard", redirectLogin, (req, res) => {
    
    res.locals.name = req.session.userName;
    
    // req.session.cookie.maxAge = parseInt(SESSION_LIFETIME)

    // req.session.test = Date.now()
    
    res.render("dashboard.pug");
    
})

app.post("/sessionExpireTime", (req, res) => {

    req.session.cookie.maxAge = parseInt(SESSION_LIFETIME)

    req.session.test = Date.now()
    
    const cookieRemainingTimeInMs = req.session.cookie.maxAge;
    const serverTimeNowInMs = Date.now();


    console.log("in fetch", serverTimeNowInMs - req.session.test)

    console.log("in fetch session remaining time", cookieRemainingTimeInMs)

    // console.log("in fetch", serverTimeNowInMs - cookieOriginalMaxAge)

    // const cookieExparationDateInMs = serverTimeNowInMs + cookieRemainingTimeInMs;


    // console.log(sessionStartTime)

    const obj = {
        // sessionStartTime: req.session.sessionStartTime,
        sessionStartTime: req.session.test,
        // sessionStartTime: serverTimeNowInMs,

        cookieRemainingTimeInMs: cookieRemainingTimeInMs,
    }

    // console.log(req.session.cookie.maxAge)
    // const expireHostLocalTime = new Date(cookieExparationDateInMs).toString();

    // res.send(JSON.stringify(expireHostLocalTime))
    // res.send(JSON.stringify(cookieExparationDateInMs))
    res.send(JSON.stringify(obj))


})


app.post("/register", (req, res) => {
    getUsersFromDB(async (connectionError, retrivingError, users) => {
        if (connectionError) {
            app.locals.registrationStatusMessage = "Something went wrong connecting to the Server. Please try to register again."

            return res.redirect("/register");
        }

        if (retrivingError) {
            app.locals.registrationStatusMessage = "Something went wrong. Please try to register again."

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
                    app.locals.registrationStatusMessage = "Something went wrong registering you. Please try again."

                    return res.redirect("/register");
                }

                console.log("New user added succesfully!")
                
                app.locals.loginStatusMessage = "You have registered succesfully! Please Log in.";
                
                res.redirect("/login");
            }

            const existingUser = users.some(user => {
                return user.email === req.body.email
            })

            if (existingUser) {
                console.log("This user already exists")

                app.locals.registrationStatusMessage = "This user already exists."
    
                res.redirect("/register");
            }
            else {
                insertUserToDB(newUserCredentials, (insertError) => {
                    if (insertError) {
                        app.locals.registrationStatusMessage = "Something went wrong registering you. Please try again."

                        return res.redirect("/register");
                    }

                    console.log("New user added succesfully!")
                    
                    app.locals.loginStatusMessage = "You have registered succesfully! Please Log in.";
                    
                    res.redirect("/login");
                });
            }
        } catch {
            console.log("Something went wrong registering you.");

            app.locals.registrationStatusMessage = "Something went wrong, please try again.";

            res.redirect("/register");
        }
    })
})

app.post("/login", (req, res) => {
    getUsersFromDB(async (connectionError, retrivingError, users) => {
        if (connectionError) {
            app.locals.loginStatusMessage = "Something went wrong connecting to the Server. Please try to log in again."

            return res.redirect("/login");
        }

        if (retrivingError) {
            app.locals.loginStatusMessage = "Something went wrong. Please try to log in again."

            return res.redirect("/login");
        }

        if (!users) {
            console.log("Data base is empty")

            app.locals.loginStatusMessage = "This user doesn't exist. Sign up please!";

            return res.redirect("/login");
        }
        const logingUser = users.find(user => {
            return user.email === req.body.email
        })

        if (!logingUser) {
            console.log("User doesn't exist")

            app.locals.loginStatusMessage = "User doesn't exist. Please register first.";

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

                app.locals.loginStatusMessage = "Wrong user name or password.";
    
                res.redirect("/login")
            }
        } catch {
            console.log("Catched")

            app.locals.loginStatusMessage = "Wrong user name or password.";

            res.redirect("/login")
        }
    })
})

app.post("/logout", (req, res) => {
    
    console.log("Cookie time left in log out", req.session.cookie.maxAge)
    
    if (req.session.cookie.maxAge < 7000) {
        app.locals.loginStatusMessage = "Your session has expired. Please log in again."
    }

    req.session.destroy((err) => {
        if (err) {
            return res.redirect("/dashboard");
        }
        
        console.log("Session deleted");
    })

    res.clearCookie(SESSION_NAME);

    sessionStore.destroy(SESSION_NAME, (err) => {
        if (err) console.log("Didn't manage to delete the session");
        
        console.log("Session Store deleted");
    })



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

app.listen(SERVER_PORT, () => {
    console.log(`Server is running at port: ${SERVER_PORT}`)
})