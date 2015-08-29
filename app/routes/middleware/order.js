// Middleware to play with req and res before rendering the page
var _ = require('underscore'),
    utils = require('./utils'),
    models = require('../../models'),
    mongoose = require('mongoose');

module.exports = {
    "validateOrderItem": function (req, res, next) {

        req.body.selectedItemExtras = (req.body.selectedItemExtras.constructor !== Array) ?
            [ req.body.selectedItemExtras ] : req.body.selectedItemExtras;
        req.body.selectedItemOptions = (req.body.selectedItemOptions.constructor !== Array) ?
            [ req.body.selectedItemOptions ] : req.body.selectedItemOptions;
        req.checkBody('selectedItemExtras', 'Please select valid extras for this item').isEmptyOrBsonOrBsonArray();
        req.checkBody('selectedItemOptions', 'Please select valid options for this item').isEmptyOrBsonOrBsonArray();
        //Validation failed
        if (!utils.validationUtility(req, res)) {
            return res.redirect('back');
        }
        next();
    },
    "buildOrderItemFromBody": function (req, res, next) {
        //todo get this from the companions from the user profile
        var Companion = models.Profile.Companion;
        Companion
            .where({ _id: req.body.itemFor})
            .findOne(function (err, companion) {
                if (err) {
                    return next(err);
                }
                req.item.itemFor = [companion];

                req.item.selectedItemExtras = _.filter(req.item.itemExtras, function (extra) {
                    return (_.indexOf(req.body.selectedItemExtras, extra.id) >= 0);
                });
                req.item.selectedItemOptions = _.filter(req.item.itemOptions, function (option) {
                    return (_.indexOf(req.body.selectedItemOptions, option.id) >= 0);
                });
                _.map(req.item.selectedItemExtras, function (extra) {
                    extra.isDefault = true;
                    return extra;
                });
                _.map(req.item.itemExtras, function (extra) {
                    extra.isDefault = false;
                    return extra;
                });
                _.map(req.item.selectedItemOptions, function (option) {
                    option.isDefault = true;
                    return option;
                });
                _.map(req.item.itemOptions, function (option) {
                    option.isDefault = false;
                    return option;
                });
                next();
            });
    },
    "sessionOrder": function (req, res, next) {
        var Order = models.Order;

        if (_.isUndefined(req.session.orderId)) {
            var orderData = {
                    user: req.user || null,
                    orderStarted: new Date(),
                    orderItems: [ req.item ]
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
                    req.order = order;
                    next();
                });
        }
    },
    "addItemToOrder": function (req, res, next) {
        var itemData = req.item.toJSON();
        delete itemData._id;
        req.order.orderItems = [];
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
