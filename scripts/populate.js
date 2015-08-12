// Populate menu items

var models = require('../app/models')
    , _ = require('underscore')
    , async = require('async')
    , mongoose = require('mongoose')
    , moment = require('moment')
    , Chance = require('chance')
    , chance = new Chance();

module.exports = function() {

    var seedGenerator = function(){
        return {
            "item": {
                "category": "Entrees",
                "title": "Filet Mignon",
                "shortDesc": "A classic - Tenderloin filet with your choice of toppings.",
                "longDesc": "A tenderloin filet from certified organic grass-fed cows. " +
                    "Cooked to perfection in a water bath set to 130 degrees, briefly seared " +
                    "under an 800 degree broiler and topped with your choice of flavor enhancers",
                "basePrice": 49.99,
                "imageUri": "/img/menu/1.jpg",
                "isFeatured": true,
                "itemFor": null,
                "itemExtras": [],
                "selectedItemExtras": [],
                "itemOptions": [],
                "selectedItemOptions": []
            },
            "itemExtras": [
                {
                    "name": "Shrimp Scampi",
                    "groupName": "Steak Toppings",
                    "shortDesc": "Shrimp sauteed in a garlic/butter/white wine sauce",
                    "price": 4.99
                },
                {
                    "name": "Blue Cheese Crumbles",
                    "groupName": "Steak Toppings",
                    "shortDesc": "Rich blue cheese and Panko crumbles, broiled to a golden crust",
                    "price": 2.99
                },
                {
                    "name": "Mushroom Medley",
                    "groupName": "Steak Toppings",
                    "shortDesc": "Our special 7-mushroom blend, sauteed in browned butter and sage",
                    "price": 3.99
                }
            ],
            "itemOptions": [
                {
                    "name": "6oz Petite Filet",
                    "groupName": "Filet Sizes",
                    "shortDesc": "6oz Petite Filet",
                    "price": -4.99
                },
                {
                    "name": "8oz Filet",
                    "groupName": "Filet Sizes",
                    "shortDesc": "8oz Filet",
                    "price": 0
                },
                {
                    "name": "10oz Hearty Filet",
                    "groupName": "Filet Sizes",
                    "shortDesc": "10oz Hearty Filet",
                    "price": 4.99
                },
                {
                    "name": "Blue Cheese Grits",
                    "groupName": "Sides",
                    "shortDesc": "Blue cheese grits, cooked southern style. Great with the Blue Cheese Crumbles!",
                    "price": 0
                },
                {
                    "name": "Baked Potato",
                    "groupName": "Sides",
                    "shortDesc": "Glorious salty, crispy skin, served with sour cream and chives",
                    "price": 0
                },
                {
                    "name": "Roasted Vegetable Blend",
                    "groupName": "Sides",
                    "shortDesc": "Onions, peppers, broccoli, cauliflower, carrots and garlic roasted in olive oil",
                    "price": 0
                }
            ]
        };
    };

    var seeder = function(num, cb) {

        var seed = seedGenerator(),
            itemExtras = [],
            itemOptions = [],
            item = null,
            Side = models.Item.Side,
            Item = models.Item.Item;

        Item.remove({}, function (err) {

            for( var i=0; i<num; i++) {
                itemExtras = _.map(seed.itemExtras, function (extra) {
                    return new Side(extra);
                });
                itemOptions = _.map(seed.itemOptions, function (option) {
                    return new Side(option);
                });
                item = new Item(seed.item);
                item.itemExtras = itemExtras;
                item.itemOptions = itemOptions;
                item.save(function (err) {
                    if (err) {
                        appGlobals.logger.info('Error: ', err);
                    }
                    appGlobals.logger.info('Seed #' + (i+1));
                });
            }

            cb();

        });
    };

    return seeder;
};
