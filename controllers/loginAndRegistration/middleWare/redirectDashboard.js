module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
        res.redirect("/dashboard");
    } else {
        next()
    }
}