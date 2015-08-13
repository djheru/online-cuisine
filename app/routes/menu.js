//=========================================================
// Menu Routes
//=========================================================

var config = appGlobals.config.get('app').routes;
var models = require('../models');

module.exports = function (express) {

    var handlers = require('./handlers/menu')(express, models);

    //set us up the router
    var routeExport = express.Router();

    //validate itemId param and store in the session
    routeExport.param('itemId', handlers.params.itemId);

    //Menu Item
    routeExport.route(config.menu.menuItem)
        .get(handlers.menuItem.get);

    return routeExport;
}
