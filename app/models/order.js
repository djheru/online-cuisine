//app/order.js
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.Types.ObjectId
    , itemSchema = require('./items/item')
    , _ = require('underscore');

module.exports = function () {
    //todo fixme : Move these to the config for per location
    var paymentTypes = [
        "cash", "visa", "mc", "discover", "amex", "giftcard"
    ];

    var orderTypes = [
        "carryout", "delivery"
    ]

    var orderSchema = Schema({
        user: { type: ObjectId, ref: 'User' },
        address: { type: ObjectId, ref: 'Address' },
        orderStarted: { type: Date },
        orderPlaced: { type: Date },
        orderConfirmed: { type: Date },
        orderComplete: { type: Date },
        paymentType: { type: String, enum: paymentTypes },
        orderType: { type: String, enum: orderTypes },
        orderItems: [ itemSchema ]
    });

    orderSchema
        .virtual('subtotal')
        .get(function () {
            var itemPrices = _.pluck(this.orderItems, 'totalPrice');
            return parseFloat(_.reduce(itemPrices, function (memo, price) {
                return parseFloat(memo) + parseFloat(price);
            }, 0)).toFixed(2);
        });

    orderSchema
        .virtual('tax')
        .get(function () {
            var taxRate = appGlobals.config.get('storeConfig').salesTaxRate;
            return parseFloat(this.subtotal * taxRate).toFixed(2);
        });

    orderSchema
        .virtual('deliveryFee')
        .get(function () {
            var deliveryFee = appGlobals.config.get('storeConfig').deliveryFee || 0;
            return parseFloat(deliveryFee).toFixed(2);
        });

    orderSchema
        .virtual('total')
        .get(function () {
            var total = parseFloat(this.subtotal) + parseFloat(this.tax) + parseFloat(this.deliveryFee);
            return parseFloat(total).toFixed(2);
        });

    orderSchema
        .set('toObject', {
            virtuals: true,
            getters: true,

        })
        .set('toJson', {
            virtuals: true,
            getters: true
        });

    return orderSchema;
}();
