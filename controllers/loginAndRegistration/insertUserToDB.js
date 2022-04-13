// INSERT USERS TO DB
module.exports = (dbPool, newUser, callback) => {
    const insertIntoUsers = `INSERT INTO users Set ?`;

    dbPool.query(insertIntoUsers, newUser, (insertError, result) => {
        if (insertError) {
            console.log("There was an error inserting the user in the DB");
            
            return callback(insertError);
        }
        callback(insertError, result);
    })
}