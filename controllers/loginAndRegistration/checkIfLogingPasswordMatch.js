const bcrypt = require("bcryptjs");
const notificationInit = require("../notificationInit");

module.exports = async (req, res, app, logingUser, callback) => {
    try {
        const isPasswordMatched = await bcrypt.compare(req.body.password, logingUser.password);

        if (isPasswordMatched) {
            callback();
        } 
        else {
            console.log("Wrong password")
    
            notificationInit(app, "loginNotification", "Wrong user name or password.")
    
            res.redirect("/login")
        }

        
    } catch (e) {
        console.log(e, "Catched! Error during comparing the hashed and user password")

        notificationInit(app, "loginNotification", "Something went wrong. Please try to log in again.")

        res.redirect("/login")
    }
}