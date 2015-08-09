// app/item/item.js
var mongoose =  require('mongoose')
    , Schema = mongoose.Schema
    , SideSchema = require('./side');

module.exports = function () {

    var itemSchema = Schema({
        category:			{ type: String },
        title:				{ type: String },
        shortDesc:			{ type: String },
        longDesc:			{ type: String },
        basePrice:			{ type: Number },
        imageUri:			{ type: String },
        isFeatured:			{ type: Boolean },
        itemFor: 			{ type: Schema.ObjectId, ref: 'Companion' },
        itemExtras:			[ SideSchema ],
        selectedItemExtras: [ SideSchema ],
        itemOptions:		[ SideSchema ],
        selectedItemOptions:[ SideSchema ]
    });

    return itemSchema;
}();