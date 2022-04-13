module.exports = (app, notificationName, message) => {
    app.locals[notificationName] = message;
}