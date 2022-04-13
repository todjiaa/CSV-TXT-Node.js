const checkIfLogingPasswordMatch = require("./checkIfLogingPasswordMatch");
const logTheUser = require("./logTheUser");
const notificationInit = require("../notificationInit");

module.exports = (req, res, users, app) => {
    const logingUser = users.find(user => {
        return user.email === req.body.email
    })

    if (!logingUser) {
        console.log("User doesn't exist")

        notificationInit(app, "loginNotification", "Wrong user name or password.")

        return res.redirect("/login")
    }
    checkIfLogingPasswordMatch(req, res, app, logingUser, () => {
        logTheUser(req, res, logingUser);
    });
}
