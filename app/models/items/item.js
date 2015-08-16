// app/item/item.js
var mongoose =  require('mongoose')
    , Schema = mongoose.Schema
    , SideSchema = require('./side')
    , _ = require('underscore');

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
        imageUri:			{ type: String },
        isFeatured:			{ type: Boolean },
        isActive:           { type: Boolean },
        itemFor: 			{ type: Schema.ObjectId, ref: 'Companion' },
        itemExtras:			[ SideSchema ],
        selectedItemExtras: [ SideSchema ],
        itemOptions:		[ SideSchema ],
        selectedItemOptions:[ SideSchema ]
    });

    itemSchema
        .virtual('totalPrice')
        .get(function () {
            console.log(this);
            var sides = this.selectedItemExtras.concat(this.selectedItemOptions);
            return parseFloat(_.reduce(sides, function (memo, price) {
                return memo + price;
            }, this.basePrice).toFixed(2));
        });

    return itemSchema;
}();
