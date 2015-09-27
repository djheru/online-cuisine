// Middleware to play with req and res before rendering the page
var _ = require('underscore'),
    utils = require('./utils'),
    models = require('../../models'),
    mongoose = require('mongoose'),
    stripe = require("stripe")(appGlobals.config.get('stripe').secret);

module.exports = {
    "stripeCharge": function (req, res, next) {
        if (req.body.paymentType !== 'card') {
            return next();
        }
        var stripeToken = req.body.stripeToken;
        var charge = stripe.charges.create({
            amount: parseInt(parseFloat(req.order.total).toFixed(2) * 100),
            currency: 'usd',
            source: stripeToken,
            description: 'Sample Charge',
        }, function (err, charge) {
            console.log("charge", charge);
            console.log("err", err);
            if (err) {
                req.flash('dangerMessage', 'There was a problem completing your order. Please call 616-216-5610 for help.');
                req.flash('dangerMessage', 'The message from the credit card processor was: "' + err.message + '"');
                req.flash('initTab', 1);
                req.flash('formBody', req.body);
                return res.redirect('back');
            } else {
                req.charge = charge;
                next();
            }
        });
    },

    "updateOrder": function (req, res, next) {
        next();
    }
};
