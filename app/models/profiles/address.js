// app/models/user.js
var mongoose =  require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.Types.ObjectId;

module.exports = function () {

    var addressSchema = Schema({
        nickname: 			{ type: String },
        streetAddress1:		{ type: String },
        streetAddress2:		{ type: String },
        city:				{ type: String },
        state: 				{ type: String },
        postalCode:			{ type: String }
    });

    return addressSchema;
}();