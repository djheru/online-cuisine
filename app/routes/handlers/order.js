//Handler for order routes
var mongoose = require('mongoose'),
    _ = require('underscore');

module.exports = function (express, models, config) {
    return {

        "params": {
            "orderItemId": function (req, res, next, orderItemId) {
                var Item = models.Item.Item;
                req.orderItemId =(mongoose.Types.ObjectId.isValid(orderItemId)) ? orderItemId : false;
                if (!req.orderItemId) {
                    return next();
                }

                Item
                    .where({_id: req.orderItemId, isActive: true})
                    .findOne(function (err, orderItem) {
                        if (err) {
                            return next(err);
                        }
                        req.orderItem = orderItem;
                        next();
                    });
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
                res.render('order-item.ejs', {
                    item: req.item,
                    csrfToken: req.csrfToken()
                });
            },
            "post": function (req, res, next) {
                req.flash('successMessage', 'The item was added to your order!');
                res.redirect(config.order.order);
            }
        },
    };
};
