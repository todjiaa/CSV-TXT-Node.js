const getUsersFromDB = require("./getUsersFromDB");
const checkIfRegisteringUserExist = require("./checkIfRegisteringUserExist");

// The object containing the messages in case of error while connecting to the Data base during registering 
const dbErrorNotification = {
    connectionErrorMessage: "Something went wrong connecting to the Server. Please try to register again.",
    retrivingErrorMessage: "Something went wrong. Please try to register again.",
    name: "registrationNotification", 
}

module.exports = (req, res, app, dbPool) => {
    getUsersFromDB(req, res, dbPool, dbErrorNotification, app, (users) => {
        checkIfRegisteringUserExist(req, res, users, dbPool, app);
    })
}