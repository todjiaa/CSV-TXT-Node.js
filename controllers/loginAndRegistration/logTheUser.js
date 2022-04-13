module.exports = (req, res, logingUser) => {
    req.session.userId = logingUser.id;

    req.session.userName = logingUser.name;

    res.redirect("/dashboard");
}