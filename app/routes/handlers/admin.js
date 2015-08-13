//Handler for protected routes
var utils = require('../middleware/utils');
module.exports = function (express, config) {

    return {

        "params": {

            "seedCount": function (req, res, next, seedCount) {
                req.seedCount = seedCount;
                return next();
            }
        },

        //Seeding items
        "seed": {
            "get": function (req, res) {
                if(process.env.SEED && process.env.SEED == 1) {
                    console.log(req.seedCount);
                    var seedCount = req.seedCount || 11;
                    appGlobals.logger.info('seeding');
                    var devSeeder = require('./../../../scripts/populate')();
                    devSeeder(seedCount, function () {
                        res.redirect('/');
                    });
                } else {
                    res.redirect('/');
                }
            }
        }
    };

};
