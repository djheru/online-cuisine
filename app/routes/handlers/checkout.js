//Handler for menu routes
var mongoose = require('mongoose'),
    _ = require('underscore'),
    stripe = require("stripe")(appGlobals.config.get('stripe').secret);

module.exports = function (express, models, config) {
    return {

        //Main menu
        "checkout": {
            "get": function (req, res, next) {
                console.log(config)
                res.render('checkout.ejs', {
                    csrfToken: req.csrfToken(),
                    total: (req.order) ? req.order.total : 0,
                    subtotal: (req.order) ? req.order.subtotal : 0,
                    deliveryFee: (req.order) ? req.order.deliveryFee : 0,
                    tax: (req.order) ? req.order.tax : 0,
                    items: (req.order && req.order.orderItems) ?
                        req.order.orderItems : []
                });
            },

            "post": function (req, res) {
                console.log(req.body);
                var stripeToken = req.body.stripeToken;
                var charge = stripe.charges.create({
                    amount: parseInt(parseFloat(req.order.total).toFixed(2) * 100),
                    currency: 'usd',
                    source: stripeToken,
                    description: 'Sample Charge',
                }, function (err, charge) {
                    if (err) {
                        req.flash('dangerMessage', 'There was a problem completing your order. Please call 616-216-5610 for help.');
                        res.redirect(config.public.home);
                    }
                    console.log(charge)
                    req.flash('successMessage', 'Your order was completed! Watch for an email confirmation.');
                    res.redirect(config.public.home);
                })

            }
        },

        //Payment
        "payment": {
            "get": function (req, res, next) {
                res.render('payment.ejs', {});

            },
            "post": function (req, res, next) {
                req.flash('successMessage', 'Your order was completed! Watch for an email confirmation.');
                res.redirect(config.public.home);
            }
        },
    };
};
