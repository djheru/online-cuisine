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
        req.checkBody('selectedItemExtras', 'Please select valid extras for this item').isEmptyOrBsonOrBsonArray();
        req.checkBody('selectedItemOptions', 'Please select valid options for this item').isEmptyOrBsonOrBsonArray();
        //Validation failed
        if (!utils.validationUtility(req, res)) {
            return res.redirect('back');
        }
        next();
    },
    "buildItemFromBody": function (req, res, next) {
        //todo get this from the companions from the user profile
        var Companion = models.Profile.Companion;
        console.log(req.body.itemFor);
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

                next();
            });
    }
};
