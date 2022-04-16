// LIBRARIES 
const express = require('express');
const session = require("express-session");
const mysql = require("mysql");
const MySqlStore = require("express-mysql-session")(session);
require("pug");

// CONTROLERS 
const notificationInit = require('./controllers/notificationInit');
const register = require('./controllers/loginAndRegistration/register');
const login = require('./controllers/loginAndRegistration/login');
const logOut = require("./controllers/loginAndRegistration/logOut");
const createExcelFile = require('./controllers/createAndDownloadExcelFile/createExcelFile');
const downloadExcelFile = require('./controllers/createAndDownloadExcelFile/downloadExcelFile');

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


// POST REQUESTS RELATED TO LOGIN AND REGISTRATION
app.post("/register", (req, res) => {
    register(req, res, app, dbPool);
})

app.post("/login", (req, res) => {
    login(req, res, app, dbPool);
})

app.post("/logout", (req, res) => {
    logOut(req, res, sessionStore);
})

// POST REQUESTS RELATED TO EXCEL FILE CREATION AND DOWNLOAD 
app.post("/createExcelFile", (req, res) => {
    createExcelFile(req, res);
})

app.post("/downloadExcelFile", (req, res) => {
    downloadExcelFile(req, res);
})

app.listen(SERVER_PORT, () => {
    console.log(`Server is running at port: ${SERVER_PORT}`)
})