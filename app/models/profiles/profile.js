// app/models/user.js
var mongoose =  require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.Types.ObjectId
    , addressSchema = require('./address')
    , companionSchema = require('./companion')
    , itemSchema = require('../items/item');

module.exports = function () {

    var profileSchema = Schema({
        _owner: { type: ObjectId, ref: 'User' },
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        phone: { type: String, required: true, trim: true },
        addresses: [ addressSchema ],
        companions: [ companionSchema ],
        favorites: [ itemSchema ]
    });

    return profileSchema;
}();