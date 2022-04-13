const bcrypt = require("bcryptjs");
const notificationInit = require("../notificationInit");

module.exports = async (req, res, callback) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        
        callback(hashedPass);
        
    } catch (e) {
        console.log(e, "Catched Error. Something went wrong hashing the password.");

        notificationInit(app, "registrationNotification", "Something went wrong, please try again.");

        res.redirect("/register");
    }
}