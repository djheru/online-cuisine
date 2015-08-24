// Middleware to play with req and res before rendering the page
var _ = require('underscore'),
    models = require('../../models');
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
    }
};
