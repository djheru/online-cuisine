//Route Handlers

module.exports = function (express, passport, models, mailer, config) {
console.log(models)
    return {
        "admin": require('./admin')(express),
        "public": require('./public')(express, passport, models, mailer, config),
        "passport": require('./passport')(express, passport, config),
        "protected": require('./protected')(express, passport, config),
        "menu": require('./menu')(express, models, config)
    }
}
