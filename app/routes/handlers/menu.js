//Handler for menu routes
var mongoose = require('mongoose'),
    _ = require('underscore');

module.exports = function (express, models, config) {
    return {

        //Middleware to glean the provider type
        "params": {
            "itemId": function (req, res, next, itemId) {
                var Item = models.Item.Item;
                req.itemId =(mongoose.Types.ObjectId.isValid(itemId)) ? itemId : false;
                if (!req.itemId) {
                    return next();
                }

                Item
                    .where({_id: req.itemId, isActive: true})
                    .findOne(function (err, item) {
                        if (err) {
                            return next(err);
                        }
                        req.item = item;
                        next();
                    });
            }
        },

        //Main menu
        "menu": {
            "get": function (req, res, next) {
                res.render('menu.ejs', {
                    items: req.items,
                    categories: req.categories
                });
            }
        },

        //Display an item
        "menuItem": {
            "get": function (req, res, next) {
                //todo this needs to go somewhere else
                var Companion = models.Profile.Companion,
                    companion = new Companion({name: "me"});

                companion.save(function (err) {
                    console.log(companion);
                    if (err) {
                        return next(err);
                    }
                    res.render('menu-item.ejs', {
                        item: req.item,
                        csrfToken: req.csrfToken(),
                        companions: [companion]
                    });
                });

            },
            "post": function (req, res, next) {
                req.flash('successMessage', 'The item was added to your order!');
                res.redirect(config.menu.menu);
            }
        },
    };
};
