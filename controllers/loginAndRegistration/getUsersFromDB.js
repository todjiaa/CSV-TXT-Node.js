const notificationInit = require("../notificationInit");

// GET USERS FROM DB
module.exports = (req, res, dbPool, dbErrorNotification, app, callback) => {
    const selectAllUsers = `SELECT * FROM users`;

    const {
        connectionErrorMessage,
        retrivingErrorMessage,
        name
    } = dbErrorNotification;

    dbPool.getConnection((connectionError, connection) => {
        if (connectionError) {
            console.log("Didn't manage to connect to Data Base", connectionError.code);

            notificationInit(app, name, connectionErrorMessage)

            return res.redirect(req.url);
        } 

        console.log("Data Base Connected");

        connection.query(selectAllUsers, (retrivingError, users) => {
            if (retrivingError) {
                console.log("There was an error retriving the users from the DB", retrivingError.code);

                notificationInit(app, name, retrivingErrorMessage)

                return res.redirect(req.url);
            }

            console.log("Users retrieved");
            
            callback(users);

            connection.release();

            console.log("connection released");
        })
    })
}