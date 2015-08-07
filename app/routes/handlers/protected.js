//Handler for protected routes
var utils = require('../middleware/utils');
module.exports = function (express, passport, config) {
    return {
        "params": {},

        //You can't even see me
        "profile": {
            "get": function (req, res) {
                res.render('profile.ejs', {});
            }
        },
        "link": {
            "get": function (req, res) {
                res.render('profile-link.ejs', {
                    csrfToken: req.csrfToken()
                });
            }
        }
    }
}
