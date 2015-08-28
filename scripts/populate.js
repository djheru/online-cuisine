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
        var categories = [
            { "title": "Steak Entrees", "slug": "steak-entrees" },
            { "title": "Pasta Entrees", "slug": "pasta-entrees" },
            { "title": "Burgers", "slug": "burgers" },
            { "title": "Seafood Entrees", "slug": "seafood-entrees" },
            { "title": "Appetizers", "slug": "appetizers" }
        ];
        category = categories[Math.floor(Math.random() * categories.length)];
        console.log(category);
        return {
            "item": {
                "category": category,
                "title": "Filet Mignon",
                "shortDesc": "A classic - Tenderloin filet with your choice of toppings.",
                "longDesc": "A tenderloin filet from certified organic grass-fed cows. " +
                    "Cooked to perfection in a water bath set to 130 degrees, briefly seared " +
                    "under an 800 degree broiler and topped with your choice of flavor enhancers",
                "basePrice": 49.99,
                "isFeatured": true,
                "isActive": true,
                "itemFor": null,
                "itemExtras": [],
                "selectedItemExtras": [],
                "itemOptions": [],
                "selectedItemOptions": [],
                "itemDeals": []
            },
            "itemExtras": [
                {
                    "name": "Shrimp Scampi",
                    "groupName": "Steak Toppings",
                    "shortDesc": "Shrimp sauteed in a garlic/butter/white wine sauce",
                    "price": 4.99,
                    "isDefault": false
                },
                {
                    "name": "Blue Cheese Crumbles",
                    "groupName": "Steak Toppings",
                    "shortDesc": "Rich blue cheese and Panko crumbles, broiled to a golden crust",
                    "price": 2.99,
                    "isDefault": false
                },
                {
                    "name": "Mushroom Medley",
                    "groupName": "Steak Toppings",
                    "shortDesc": "Our special 7-mushroom blend, sauteed in browned butter and sage",
                    "price": 3.99,
                    "isDefault": false
                },
                {
                    "name": "French Onions",
                    "groupName": "Extras",
                    "shortDesc": "Light crispy onions",
                    "price": 0,
                    "isDefault": false
                },
                {
                    "name": "au jus",
                    "groupName": "Extras",
                    "shortDesc": "The juice",
                    "price": 0,
                    "isDefault": false
                }
            ],
            "itemOptions": [
                {
                    "name": "6oz Petite Filet",
                    "groupName": "Filet Size",
                    "shortDesc": "6oz Petite Filet",
                    "price": -4.99,
                    "isDefault": false
                },
                {
                    "name": "8oz Filet",
                    "groupName": "Filet Size",
                    "shortDesc": "8oz Filet",
                    "price": 0,
                    "isDefault": true
                },
                {
                    "name": "10oz Hearty Filet",
                    "groupName": "Filet Size",
                    "shortDesc": "10oz Hearty Filet",
                    "price": 4.99,
                    "isDefault": false
                },
                {
                    "name": "Blue Cheese Grits",
                    "groupName": "Sides",
                    "shortDesc": "Blue cheese grits, cooked southern style. Great with the Blue Cheese Crumbles!",
                    "price": 0,
                    "isDefault": false
                },
                {
                    "name": "Baked Potato",
                    "groupName": "Sides",
                    "shortDesc": "Glorious salty, crispy skin, served with sour cream and chives",
                    "price": 0,
                    "isDefault": true
                },
                {
                    "name": "Roasted Vegetable Blend",
                    "groupName": "Sides",
                    "shortDesc": "Onions, peppers, broccoli, cauliflower, carrots and garlic roasted in olive oil",
                    "price": 0,
                    "isDefault": false
                }
            ],
            "itemDeals": [
                {
                    "title": "Lunch Special",
                    "description": "Save 10% on our great lunch specials (10am - 2pm Monday-Friday)",
                    "dealType": "percentDiscount",
                    "discountPercent": 10,
                    "numberOfItems": 1
                },
                {
                    "title": "Happy Hour Special",
                    "description": "Save 20% on our great happy hour deals (4pm - 6pm Monday-Friday)",
                    "dealType": "percentDiscount",
                    "discountPercent": 20,
                    "numberOfItems": 1
                },
                {
                    "title": "Wednesday Dinner Special",
                    "description": "Order a dinner special for just 19.99 (4pm - 8pm Wednesdays)",
                    "dealType": "reducedPriceDiscount",
                    "reducedPrice": 19.99,
                    "numberOfItems": 1
                }
            ]
        };
    };

    var seeder = function(num, cb) {

        var seed,
            itemExtras = [],
            itemOptions = [],
            itemDeals = [],
            item = null,
            Side = models.Item.Side,
            Item = models.Item.Item,
            Deal = models.Item.Deal;

        Item.remove({}, function (err) {

            for( var i=0; i<num; i++) {
                seed = seedGenerator();
                itemExtras = _.map(seed.itemExtras, function (extra) {
                    return new Side(extra);
                });
                itemOptions = _.map(seed.itemOptions, function (option) {
                    return new Side(option);
                });
                itemDeals = _.map(seed.itemDeals, function (deal) {
                    return new Deal(deal);
                });

                seed.item.imageUri = ((i % 3) == 1) ? '/img/menu/default.png' : "/img/menu/1.jpg";
                console.log(seed.item.imageUri);

                item = new Item(seed.item);
                item.itemExtras = itemExtras;
                item.itemOptions = itemOptions;
                item.itemDeals = itemDeals;
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
