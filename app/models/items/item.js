// app/item/item.js
var mongoose =  require('mongoose')
    , Schema = mongoose.Schema
    , SideSchema = require('./side')
    , DealSchema = require('./deal')
    , _ = require('underscore')
    , discountStrategies = {
        //$4.00 lunch special, i.e. Items a certain price, actual discount may vary
        "reducedPriceDiscount": function (basePrice, deal) {
            return parseFloat(deal.reducedPrice).toFixed(2);
        },

        //50% Off
        "percentDiscount": function (basePrice, deal) {
            return parseFloat(basePrice * (1 - (.01 * deal.discountPercent))).toFixed(2);
        },

        //$2.00 off
        "amountDiscount": function (basePrice, deal) {
            return parseFloat(basePrice - deal.discountAmount).toFixed(2);;
        },

        ///4 for $20
        "multiItemPricingDiscount": function (item) {
            return item;
        },

        //Buy one get one 40% off
        "multiItemSinglePercentDiscount": function (item) {
            return item;
        },

        //Save 50% when you buy 3
        "multiItemTotalPercentDiscount": function (item) {
            return item;
        },

        //Save $5 when you buy 3
        "multiItemAmountDiscount": function (item) {
            return item;
        }
    };

module.exports = function () {

    var itemSchema = Schema({
        category:			{
            slug: { type: String },
            title: { type: String }
        },
        title:				{ type: String },
        shortDesc:			{ type: String },
        longDesc:			{ type: String },
        basePrice:			{ type: Number },
        retailPrice:        { type: Number },//after discounts
        imageUri:			{ type: String },
        isFeatured:			{ type: Boolean },
        isActive:           { type: Boolean },
        itemFor: 			{ type: Schema.ObjectId, ref: 'Companion' },
        itemExtras:			[ SideSchema ],
        selectedItemExtras: [ SideSchema ],
        itemOptions:		[ SideSchema ],
        selectedItemOptions:[ SideSchema ],
        itemDeals:          [ DealSchema ]
    });

    itemSchema
        .virtual('totalPrice')
        .get(function () {
            var sides = this.selectedItemExtras.concat(this.selectedItemOptions);
            return parseFloat(_.reduce(sides, function (memo, price) {
                return memo + price;
            }, this.salePrice)).toFixed(2);
        });

    itemSchema
        .virtual('selectedDeal')
        .get(function () {
            var bestDeal = {},
                lowestPrice = this.basePrice
                parseIterator = function (deal) {
                    if (discountStrategies[deal.dealType](this.basePrice, deal) < lowestPrice) {
                        bestDeal = deal;
                    }
                }.bind(this);

            if (this.itemDeals.length == 0) {
                return bestDeal;
            }
            _.each(this.itemDeals, parseIterator);
            return bestDeal;
            return parseFloat(lowestPrice).toFixed(2);
        });

    itemSchema
        .virtual('salePrice')
        .get(function () {
            var deal = this.selectedDeal
                , lowestPrice = this.basePrice;
            if (deal.dealType) {
                lowestPrice = discountStrategies[deal.dealType](this.basePrice, deal);
            }
            return parseFloat(lowestPrice).toFixed(2);
        });

    itemSchema
        .set('toObject', {
            virtuals: true,
            getters: true,

        })
        .set('toJson', {
            virtuals: true,
            getters: true
        });

    return itemSchema;
}();
