// Middleware to play with req and res before rendering the page
var _ = require('underscore'),
    utils = require('./utils'),
    models = require('../../models'),
    mongoose = require('mongoose');

module.exports = {
    "sessionOrder": function (req, res, next) {
        var Order = models.Order;

        if (_.isUndefined(req.session.orderId)) {
            var orderData = {
                    user: req.user || null,
                    orderStarted: new Date(),
                    orderItems: (req.item) ? [ req.item ] : []
                },
                order = new Order(orderData);

            order.save(function (err) {
                if (err) {
                    return next(err);
                }
                req.session.orderId = order.id;
                req.order = order;
                return next();
            });

        } else {
            Order
                .where({_id: req.session.orderId})
                .findOne(function (err, order) {
                    if (err) {
                        return next(err);
                    }
                    if (!order) {
                        delete req.session.orderId;
                    }

                    req.order = order;

                    //guest with order just logged in
                    if (!order.user && req.user) {
                        order.user = req.user;
                        _.map(order.orderItems, function (item) {
                            item.itemFor = req.user.profiles[0].companions[0];
                        });
                        order.save(function (err) {
                            if(err) {
                                return next(err);
                            }
                            return next();
                        })
                    } else {
                        next();
                    }

                });
        }
    },
    "addItemToOrder": function (req, res, next) {
        var itemData = req.item.toJSON();
        delete itemData._id;
        //req.order.orderItems = [];
        req.order.orderItems.push(itemData);
        req.order.save(function (err) {
            return (err) ? next(err) : next();
        });
    },
    "removeItemFromOrder": function (req, res, next) {
        req.order.orderItems.id(req.item.id).remove();
        req.order.save(function (err) {
            return (err) ? next(err) : next();
        });
    },
    "editOrderItem": function (req, res, next) {
        req.order.save(function (err) {
            return (err) ? next(err) : next();
        });

    }
};
