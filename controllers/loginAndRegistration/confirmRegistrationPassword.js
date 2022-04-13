const hashRegisteringUserPassword = require("./hashRegisteringUserPassword");
const notificationInit = require("../notificationInit");
const registerTheUser = require("./registerTheUser");

module.exports = (req, res, app, dbPool) => {
    if (req.body.password === req.body["confirm-password"]) {

        console.log("Pass matching")

        hashRegisteringUserPassword(req, res, (hashedPass) => {
            registerTheUser(req, res, hashedPass, dbPool, app);
        })
    }
    else {
        console.log("password doesn't match")

        notificationInit(app, "registrationNotification", "Password doesn't match!");

        return res.redirect("/register");
    }
}