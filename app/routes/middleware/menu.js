// Middleware to play with req and res before rendering the page
var _ = require('underscore'),
    utils = require('./utils'),
    models = require('../../models'),
    mongoose = require('mongoose');

module.exports = {
    "items": function (req, res, next) {
        var Item = models.Item.Item;
        Item
            .find({isActive: true})
            .exec(function (err, items) {
                if (err) {
                    return next(err);
                }
                req.items = items;
                next();
            });
    },
    "categories": function (req, res, next) {
        if (!req.items) {
            return next();
        }
        var itemCategories = _.pluck(req.items, 'category');
        var uniqueCategories = _.uniq(itemCategories, false, function (category) {
            return category.slug;
        });
        req.categories = _.sortBy(uniqueCategories, 'slug');
        next();
    },
    "validateItem": function (req, res, next) {
        req.checkBody('selectedItemExtras', 'Please select valid extras for this item').isEmptyOrBsonArray();
        req.checkBody('selectedItemOptions', 'Please select valid options for this item').isEmptyOrBsonArray();
        //Validation failed
        if (!utils.validationUtility(req, res)) {
            return res.redirect('back');
        }
        next();
    },
    "buildItemFromBody": function (req, res, next) {
        req.item.selectedItemExtras = _.filter(req.item.itemExtras, function (extra) {
            return (_.indexOf(req.body.selectedItemExtras, extra.id) >= 0);
        });
        req.item.selectedItemOptions = _.filter(req.item.itemOptions, function (option) {
            return (_.indexOf(req.body.selectedItemOptions, option.id) >= 0);
        });
        next();
    },
    "addItemToOrder": function (req, res, next) {
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
                return next();
            });

        } else {
            Order
                .where({_id: req.session.orderId})
                .findOne(function (err, order) {
                    if (err) {
                        return next(err);
                    }
                    order.orderItems.push(req.item);
                    order.save(function (err) {
                        return (err) ? next(err) : next();
                    });
                });
        }
    }
};
