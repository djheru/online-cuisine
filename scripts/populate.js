// Populate users with accounts
global.appGlobals   = {};
appGlobals.config   = require('../config')('development');

var models = require('../app/models')()
    , _ = require('underscore')
    , mongoose = require('mongoose')
    , moment = require('moment')
    , Chance = require('chance')
    , chance = new Chance();

module.exports = function() {

    var seedGenerator = function(cb){
        var data = {

        };

        cb(null, data);
    };

    var seeder = function(num) {

        for( var i=0; i<num; i++) {

            seedGenerator(function(err, seed){
                if(err){
                    console.log(err)
                }

                /*Do something like
                entity = new Entity(seed);
                entity.save(function (err) {
                    if(err){
                        console.log("ERROR: ", err);
                    }
                    return;
                });
                */
            });

        }

    };

    return seeder;
};
