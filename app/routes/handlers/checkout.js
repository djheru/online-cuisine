//Handler for menu routes
var mongoose = require('mongoose'),
    _ = require('underscore');

module.exports = function (express, models, config) {
    return {

        //Main menu
        "checkout": {
            "get": function (req, res, next) {
                res.render('checkout.ejs', {
                    items: (req.order && req.order.orderItems) ?
                        req.order.orderItems : []
                });
            }
        },

        //Display an item
        "payment": {
            "get": function (req, res, next) {
                res.render('payment.ejs', {});

            },
            "post": function (req, res, next) {
                req.flash('successMessage', 'Your order was completed!');
                res.redirect(config.menu.menu);
            }
        },
    };
};
