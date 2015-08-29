//=========================================================
// Order Routes
//=========================================================

var config = appGlobals.config.get('app').routes;
var models = require('../models');
var middleware = require('./middleware/index');

module.exports = function (express) {

    var handlers = require('./handlers/order')(express, models, config);

    //set us up the router
    var routeExport = express.Router();

    //use middleware to retrieve order from session
    routeExport.use(middleware.order.sessionOrder);

    //validate itemId param and store in the request
    routeExport.param('orderItemId', handlers.params.orderItemId);

    //Order items and details
    routeExport.route(config.order.order)
        .get(handlers.order.get);

    //Order Item
    routeExport.route(config.order.orderItem)
        //order item form
        .get(handlers.orderItem.get)
        //edit order Item
        .post(middleware.order.validateOrderItem)
        .post(middleware.order.buildOrderItemFromBody)
        .post(middleware.order.editOrderItem)
        .post(handlers.orderItem.post);

    //Remove Order Item
    routeExport.route(config.order.removeItem)
        //delete item confirmation
        .get(handlers.removeItem.get)

        //Handle removal
        .post(middleware.order.removeItemFromOrder)
        .post(handlers.removeItem.post);



    return routeExport;
};
