//Models Index
var mongoose = require('mongoose');

module.exports = function() {

    var userSchema = require('./user')
        , Profile = require('./profiles')
        , Item = require('./items');
    return {
        "User": mongoose.model('User', userSchema),
        "Profile": Profile,
        "Item": Item
    };
}();
