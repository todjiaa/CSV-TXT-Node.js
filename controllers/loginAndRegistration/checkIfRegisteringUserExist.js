const confirmRegistrationPassword = require("./confirmRegistrationPassword");
const notificationInit = require("../notificationInit");

module.exports = (req, res, users, dbPool, app) => {
    const existingUser = users.some(user => {
        return user.email === req.body.email
    })

    if (existingUser) {
        console.log("This user already exists")
        
        notificationInit(app, "registrationNotification", "This user already exists.")
        
        return res.redirect("/register");
    }
    
    confirmRegistrationPassword(req, res, app, dbPool);
}