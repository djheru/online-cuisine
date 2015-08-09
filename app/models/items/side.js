// app/item/side.js
var mongoose =  require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.Types.ObjectId;

module.exports = function () {

    var sideSchema = Schema({
        name:				{ type: String },
        groupName:			{ type: String },
        price:				{ type: Number }
    });

    return sideSchema;
}();