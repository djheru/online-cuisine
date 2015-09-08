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
                if (!req.order || !_.isArray(req.order.orderItems) || _.isEmpty(req.order.orderItems)) {
                    req.flash('infoMessage', 'You don\'t have anything added to your order yet!');
                    res.redirect(config.menu.menu);
                } else {
                    res.render('order.ejs', {
                        order: req.order || null,
                        items: (req.order && req.order.orderItems) ?
                            req.order.orderItems : []
                    });
                }
            }
        },

        //Display/edit an order item
        "orderItem": {
            "get": function (req, res) {
                //todo this needs to go somewhere else
                var Companion = models.Profile.Companion,
                    companion = new Companion({name: "me"});

                companion.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.render('order-item.ejs', {
                        item: req.item,
                        csrfToken: req.csrfToken(),
                        companions: [companion]
                    });
                });
            },
            "post": function (req, res, next) {
                req.flash('successMessage', 'The item was updated!');
                res.redirect(config.order.order);
            }
        },

        "removeItem": {
            "get": function (req, res) {
                res.render('remove-order-item.ejs', {
                    item: req.item,
                    csrfToken: req.csrfToken()
                });
            },
            "post": function (req, res) {
                req.flash('successMessage', 'The item was removed from your order!');
                res.redirect(config.order.order);
            }
        }
    };
};
