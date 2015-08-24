// app/item/deal.js
var mongoose =  require('mongoose')
    , Schema = mongoose.Schema
    , _ = require('underscore');

module.exports = function () {

    var dealTypes = [
        //$4.00 lunch special, i.e. Items a certain price, actual discount may vary
        "reducedPriceDiscount",

        //50% Off
        "percentDiscount",

        //$2.00 off
        "amountDiscount",

        ///4 for $20
        "multiItemPricingDiscount",

        //Buy one get one 40% off
        "multiItemSinglePercentDiscount",

        //Save 50% when you buy 3
        "multiItemTotalPercentDiscount",

        //Save $5 when you buy 3
        "multiItemAmountDiscount"//
    ];

    var dealSchema = Schema({
        title: { type: String },
        description: { type: String },
        dealType: { type: String, enum: dealTypes },
        discountPercent: { type: Number },
        discountAmount: { type: Number },
        reducedPrice: { type: Number },
        numberOfItems: { type: Number },//Number of items required for deal, 0 = any
        activeDays: [ Number ],//0-indexed days of week
        activeHours:[ Number ]//0-24 (overridden by location open hours)
    });

    dealSchema
        .virtual('dealTypes')
        .get(function () {
            return dealTypes;
        });

    return dealSchema;
}();
