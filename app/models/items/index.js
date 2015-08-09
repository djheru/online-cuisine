//Item models index
var mongoose = require('mongoose');

module.exports = function() {
    var itemSchema = require('./item')
        , sideSchema = require('./side');

    return {
        "Item": mongoose.model('Item', itemSchema),
        "Side": mongoose.model('Side', sideSchema)
    };
}();