//=========================================================
// Protected (admin) Routes
//=========================================================

var config = appGlobals.config.get('app').routes
    , middleware = require('./middleware/index');

module.exports = function (express) {

    console.log('Loading admin routes for ' + config.admin.seed);

    var handlers = require('./handlers/admin')(express, config);

    //set us up the router
    var routeExport = express.Router();

    //use middleware to ensure authenticated
    routeExport.use(middleware.isLoggedIn);

    //Seed count param
    routeExport.param('seedCount', handlers.params.seedCount);

    //seeding
    routeExport.route(config.admin.seed)
        .get(handlers.seed.get);

    return routeExport;

}
