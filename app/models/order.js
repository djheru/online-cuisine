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
    ]
    var orderSchema = Schema({
        user: { type: ObjectId, ref: 'User' },
        address: { type: ObjectId, ref: 'Address' },
        orderStarted: { type: Date },
        orderPlaced: { type: Date },
        orderConfirmed: { type: Date },
        orderComplete: { type: Date },
        paymentType: { type: String, enum: paymentTypes },
        orderItems: [ itemSchema ]
    });

    orderSchema
        .virtual('totalPrice')
        .get(function () {
            var itemPrices = _.pluck(this.orderItems, 'totalPrice');
            return parseFloat(_.reduce(itemPrices, function (memo, price) {
                return parseFloat(memo) + parseFloat(price);
            }, 0)).toFixed(2);
        })

    return orderSchema;
}();
