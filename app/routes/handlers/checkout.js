//Handler for menu routes
var mongoose = require('mongoose'),
    _ = require('underscore');

module.exports = function (express, models, config) {
    return {

        //Main menu
        "checkout": {
            "get": function (req, res, next) {
                res.render('checkout.ejs', {
                    total: (req.order) ? req.order.total : 0,
                    subtotal: (req.order) ? req.order.subtotal : 0,
                    deliveryFee: (req.order) ? req.order.deliveryFee : 0,
                    tax: (req.order) ? req.order.tax : 0,
                    items: (req.order && req.order.orderItems) ?
                        req.order.orderItems : []
                });
            }
        },

        //Payment
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
