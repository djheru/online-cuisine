//=========================================================
// Menu Routes
//=========================================================

var config = appGlobals.config.get('app').routes;
var models = require('../models');
var middleware = require('./middleware/index');

module.exports = function (express) {

    var handlers = require('./handlers/menu')(express, models);

    //set us up the router
    var routeExport = express.Router();

    //validate itemId param and store in the session
    routeExport.param('itemId', handlers.params.itemId);

    //Main Menu
    routeExport.route(config.menu.menu)
        .get(middleware.menu.items)
        .get(middleware.menu.categories)
        .get(handlers.menu.get);

    //Menu Item
    routeExport.route(config.menu.menuItem)
        .get(handlers.menuItem.get);

    return routeExport;
};
