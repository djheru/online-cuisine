//Profile models index
var mongoose = require('mongoose');

module.exports = function() {
    var profileSchema = require('./profile')
        , companionSchema = require('./companion')
        , addressSchema = require('./address');

    return {
        "Profile": mongoose.model('Profile', profileSchema),
        "Companion": mongoose.model('Companion', companionSchema),
        "Address": mongoose.model('Address', addressSchema)
    };
}();