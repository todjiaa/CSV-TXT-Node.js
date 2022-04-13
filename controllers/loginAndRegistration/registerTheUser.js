const notificationInit = require("../notificationInit");
const insertUserToDB = require("./insertUserToDB");

module.exports = (req, res, hashedPass, dbPool, app) => {
    const newUserCredentials = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPass
    }
    
    insertUserToDB(dbPool, newUserCredentials, (insertError) => {
        if (insertError) {
            notificationInit(app, "registeringNotification", "Something went wrong registering you. Please try again.")

            return res.redirect("/register");
        }

        console.log("New user added succesfully!")
        
        notificationInit(app, "loginNotification", "You have registered succesfully! Please Log in.")
        
        res.redirect("/login");
    });
}