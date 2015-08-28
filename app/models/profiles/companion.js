// app/models/user.js
var mongoose =  require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.Types.ObjectId;

module.exports = function () {

    var companionSchema = Schema({
        name: { type: String }
    });

    return companionSchema;
}();
