// app/models/user.js
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.Types.ObjectId
    , bcrypt = require('bcrypt-nodejs')
    , uuid = require('node-uuid')
    , _ = require('underscore')
    , ProfileSchema = require('./profiles/profile')
    , CompanionSchema = require('./profiles/companion');

module.exports = function(){

    // define the schema
    var userSchema = Schema({
        local: {
            email: String,
            password: String,
            resetToken: String,
            resetTokenExpires: Date
        },
        facebook: {
            id: String,
            token: String,
            email: String,
            displayName: String
        },
        twitter: {
            id: String,
            token: String,
            displayName: String,
            username: String
        },
        google: {
            id: String,
            token: String,
            email: String,
            displayName: String
        },
        profiles: [ProfileSchema]
    });

// methods ================================================

// generating a hash
    userSchema.methods.generateHash = function(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(appGlobals.config.get('saltWorkFactor')), null);
    };

//Reset token for forgotten passwords
    userSchema.methods.generateResetToken = function(){
        return  uuid.v1();
    };

// check password against hash
    userSchema.methods.validPassword = function(password){
        return bcrypt.compareSync(password, this.local.password);
    }

//Merge two users together into one (solve duplicate accounts)
    userSchema.methods.generateMergedObject = function(mergeUser){
        var mergeUserObj = mergeUser.toObject({ getters: false, virtuals: false });
        var thisObj = this.toObject({ getters: false, virtuals: false });
        delete mergeUserObj._id;
        delete thisObj._id;
        return _.defaults(thisObj, mergeUserObj)
    };

    //have a default profile for users
    userSchema.pre("save", function (next) {
        if (!this.profiles || this.profiles.length == 0) {
            var Companion = mongoose.model('companion', CompanionSchema),
                Profile = mongoose.model('profile', ProfileSchema),
                companion = new Companion(),
                profile = new Profile({ companions: [ companion ] });
            this.profiles = [];
            this.profiles.push(profile);
        }
        next();
    });

    return userSchema;
}();
