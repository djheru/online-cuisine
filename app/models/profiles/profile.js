// app/models/user.js
var mongoose =  require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.Types.ObjectId
    , AddressSchema = require('./address')
    , CompanionSchema = require('./companion')
    , ItemSchema = require('../items/item');

module.exports = function () {

    var profileSchema = Schema({
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        phone: { type: String, trim: true },
        addresses: [ AddressSchema ],
        companions: [ CompanionSchema ],
        favorites: [ ItemSchema ]
    });

    return profileSchema;
}();
