// routeExport Indexz
module.exports = function (express, passport) {

    var routeExport = {};

    routeExport.admin       = require('./admin')(express);
    routeExport.passport    = require('./passport')(express, passport);
    routeExport.protected   = require('./protected')(express, passport);
    routeExport.public      = require('./public')(express, passport);
    routeExport.menu        = require('./menu')(express);
    routeExport.order       = require('./order')(express);

    return routeExport;
};
