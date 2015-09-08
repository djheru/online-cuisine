//Handler for protected routes
var utils = require('../middleware/utils');
module.exports = function (express, passport, config) {
    return {
        "params": {
            "addressId": function (req, res, next, addressId) {
                return next();
            },

            "companionId": function (req, res, next, companionId) {
                return next();
            },

            "favoriteId": function (req, res, next, favoriteId) {
                return next();
            },

            "seedCount": function (req, res, next, seedCount) {
                req.seedCount = seedCount;
                return next();
            }
        },

        //You can't even see me
        "profile": {
            "get": function (req, res) {
                console.log('profile')
                res.render('profile.ejs', {});
            }
        },
        "link": {
            "get": function (req, res) {
                res.render('profile-link.ejs', {
                    csrfToken: req.csrfToken()
                });
            }
        },

        //Address Handlers
        "createAddress": {
            "get": function (req, res) {
                res.render('address.ejs', {
                    csrfToken: req.csrfToken()
                });
            },
            "post": function (req, res) {
                req.flash('successMessage', 'Your address has been created');
                res.redirect(config.protected.profile);
            }
        },
        "editAddress": {
            "get": function (req, res) {
                res.render('address.ejs', {
                    csrfToken: req.csrfToken()
                });
            },
            "post": function (req, res) {
                req.flash('successMessage', 'Your address has been updated');
                res.redirect(config.protected.profile);
            }
        },
        "deleteAddress": {
            "get": function (req, res) {
                res.render('address-deleted.ejs', {
                    csrfToken: req.csrfToken()
                });
            },
            "post": function (req, res) {
                req.flash('successMessage', 'Your address has been deleted');
                res.redirect(config.protected.profile);
            }
        },

        //Companions Handlers
        "createCompanion": {
            "post": function (req, res) {
                res.render('companion-saved.ejs');
            }
        },
        "deleteCompanion": {
            "post": function (req, res) {
                res.render('companion-deleted.ejs');
            }
        },

        //Favorites Handlers
        "createFavorite": {
            "post": function (req, res) {
                res.render('favorite-saved.ejs');
            }
        },
        "deleteFavorite": {
            "post": function (req, res) {
                res.render('favorite-deleted.ejs');
            }
        },

        //Order History
        "orders": {
            "get": function (req, res) {
                res.render('order-history.ejs');
            }
        },

        //Seeding
        "seed": {
            "get": function (req, res) {
                if(process.env.SEED && process.env.SEED == 1) {
                    var seedCount = req.seedCount || 11;
                    appGlobals.logger.info('seeding');
                    var devSeeder = require('./../../../scripts/populate')();
                    devSeeder(seedCount, function () {
                        res.redirect('/');
                    });
                }
            }
        }
    }
}
