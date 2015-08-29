//Handler for order routes
var mongoose = require('mongoose'),
    _ = require('underscore');

module.exports = function (express, models, config) {
    return {

        "params": {
            "orderItemId": function (req, res, next, orderItemId) {
                req.orderItemId =(mongoose.Types.ObjectId.isValid(orderItemId)) ?
                    orderItemId : false;
                if (req.orderItemId) {
                    req.item = req.order.orderItems.id(req.orderItemId);
                }

                return next();
            }
        },

        //Main order page
        "order": {
            "get": function (req, res, next) {
                res.render('order.ejs', {
                    order: req.order || null,
                    items: (req.order && req.order.orderItems) ?
                        req.order.orderItems : []
                });
            }
        },

        //Display an item
        "orderItem": {
            "get": function (req, res) {
                //todo this needs to go somewhere else
                var Companion = models.Profile.Companion,
                    companion = new Companion({name: "me"});

                companion.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    console.log(req.item)
                    res.render('order-item.ejs', {
                        item: req.item,
                        csrfToken: req.csrfToken(),
                        companions: [companion]
                    });
                });
            },
            "post": function (req, res, next) {
                req.flash('successMessage', 'The item was added to your order!');
                res.redirect(config.order.order);
            }
        },
    };
};
