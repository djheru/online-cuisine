//Item models index
var mongoose = require('mongoose');

module.exports = function() {
    var itemSchema = require('./item')
        , sideSchema = require('./side')
        , dealSchema = require('./deal');

    return {
        "Item": mongoose.model('Item', itemSchema),
        "Side": mongoose.model('Side', sideSchema),
        "Deal": mongoose.model('Deal', dealSchema)
    };
}();
