const getUsersFromDB = require("./getUsersFromDB");
const checkIfLogingUserExist = require("./checkIfLogingUserExist");

// The object containing the messages in case of error while connecting to the Data base during login
const dbErrorNotification = {
    connectionErrorMessage: "Something went wrong connecting to the Server. Please try to log in again.",
    retrivingErrorMessage: "Something went wrong. Please try to log in again.",
    name: "loginNotification", 
}

module.exports = (req, res, app, dbPool) => {
    getUsersFromDB(req, res, dbPool, dbErrorNotification, app, (users) => {
        checkIfLogingUserExist(req, res, users, app);
    })
}