// Middleware to play with req and res before rendering the page
var _ = require('underscore'),
    utils = require('./utils'),
    models = require('../../models'),
    mongoose = require('mongoose');

module.exports = {
    "items": function (req, res, next) {
        var Item = models.Item.Item,
            params = req.params ? req.params : {isActive: true};
        Item
            .find(params)
            .exec(function (err, items) {
                if (err) {
                    return next(err);
                }
                req.items = items || [];
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
        //If only one selected, value is a string, so wrap it in an array
        req.body.selectedItemExtras = (req.body.selectedItemExtras && !_.isArray(req.body.selectedItemExtras)) ?
            [ req.body.selectedItemExtras ] : req.body.selectedItemExtras;
        req.body.selectedItemOptions = (req.body.selectedItemExtras && !_.isArray(req.body.selectedItemOptions)) ?
            [ req.body.selectedItemOptions ] : req.body.selectedItemOptions;

        //validate that it's an array of bson if it exists
        req.checkBody('selectedItemExtras', 'Please select valid extras for this item').isEmptyOrBsonOrBsonArray();
        req.checkBody('selectedItemOptions', 'Please select valid options for this item').isEmptyOrBsonOrBsonArray();

        //Validation failed
        if (!utils.validationUtility(req, res)) {
            return res.redirect('back');
        }
        next();
    },
    "buildItemFromBody": function (req, res, next) {
        var Companion = models.Profile.Companion;

        req.item.itemFor = (req.user && req.user.profiles) ?
            req.user.profiles.id(req.body.itemFor) : new Companion({name: "Me" });

        req.item.selectedItemExtras = _.filter(req.item.itemExtras, function (extra) {
            return (_.indexOf(req.body.selectedItemExtras, extra.id) >= 0);
        });
        req.item.selectedItemOptions = _.filter(req.item.itemOptions, function (option) {
            return (_.indexOf(req.body.selectedItemOptions, option.id) >= 0);
        });
        _.map(req.item.itemExtras, function (extra) {
            extra.isDefault = false;
            return extra;
        });
        _.map(req.item.selectedItemExtras, function (extra) {
            extra.isDefault = true;
            return extra;
        });
        _.map(req.item.itemOptions, function (option) {
            option.isDefault = false;
            return option;
        });
        _.map(req.item.selectedItemOptions, function (option) {
            option.isDefault = true;
            return option;
        });
        next();
    }
};
