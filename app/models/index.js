//Models Index
var mongoose = require('mongoose');

module.exports = function() {

    var userSchema = require('./user')
        , orderSchema = require('./order')
        , Profile = require('./profiles')
        , Item = require('./items');
    return {
        "User": mongoose.model('User', userSchema),
        "Order": mongoose.model('Order', orderSchema),
        "Profile": Profile,
        "Item": Item
    };
}();
