//=========================================================
// Protected (profile) Routes
//=========================================================

var config = appGlobals.config.get('app').routes
    , middleware = require('./middleware/index');

module.exports = function (express, passport) {

    var handlers = require('./handlers/protected')(express, passport, config);

    //set us up the router
    var routeExport = express.Router();

    //use middleware to ensure authenticated
    routeExport.use(middleware.isLoggedIn);

    //Address id param
    routeExport.param('addressId', handlers.params.addressId);

    //Companion id param
    routeExport.param('companionId', handlers.params.companionId);

    //Favorite id param
    routeExport.param('favoriteId', handlers.params.favoriteId);

    //profile page
    routeExport.route(config.protected.profile)
        .get(handlers.profile.get);
    //link local account to existing provider login
    routeExport.route(config.protected.link)
        .get(handlers.link.get);

    //create address
    routeExport.route(config.protected.addresses)
        .get(handlers.createAddress.get)
        .post(handlers.createAddress.post);
    //edit address
    routeExport.route(config.protected.address)
        .get(handlers.editAddress.get)
        .post(handlers.editAddress.post);
    //delete address
    routeExport.route(config.protected.addressDelete)
        .get(handlers.deleteAddress.get)
        .post(handlers.deleteAddress.post);

    //create companion
    routeExport.route(config.protected.companions)
        .post(handlers.createCompanion.post);
    //delete companion
    routeExport.route(config.protected.companion)
        .post(handlers.deleteCompanion.post);

    //create favorite
    routeExport.route(config.protected.favorites)
        .post(handlers.createFavorite.post);
    //delete favorite
    routeExport.route(config.protected.favorite)
        .post(handlers.deleteFavorite.post);

    //order history
    routeExport.route(config.protected.orders)
        .get(handlers.orders.get);

    return routeExport;
};
