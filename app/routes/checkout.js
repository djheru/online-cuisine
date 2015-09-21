//=========================================================
// Checkout Routes
//=========================================================

var config = appGlobals.config.get('app').routes;
var models = require('../models');
var middleware = require('./middleware/index');

module.exports = function (express) {

    var handlers = require('./handlers/checkout')(express, models, config);

    //set us up the router
    var routeExport = express.Router();

    //use middleware to retrieve order from session
    routeExport.use(middleware.order.sessionOrder);

    //Checkout
    routeExport.route(config.checkout.checkout)
        .get(handlers.checkout.get)
        .post(handlers.checkout.post);

    return routeExport;
};
