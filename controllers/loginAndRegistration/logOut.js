const {
    SESSION_NAME,
} = process.env

module.exports = (req, res, sessionStore) => {
    console.log("Cookie time left in log out", req.session.cookie.maxAge)

    req.session.destroy((err) => {
        if (err) res.redirect("/dashboard");
        
        console.log("Session deleted");
    })

    res.clearCookie(SESSION_NAME);

    sessionStore.destroy(SESSION_NAME, (err) => {
        if (err) console.log("Didn't manage to delete the session");
        
        console.log("Session Store deleted");
    })
    
    res.redirect("/login");
}