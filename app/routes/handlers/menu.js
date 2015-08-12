//Handler for menu routes
module.exports = function (express,  config) {
    return {

        //Middleware to glean the provider type
        "params": {
            "itemId": function (req, res, next, itemId) {
                req.itemId = itemId;
                next();
            }
        },

        //Display an item
        "menuItem": {
            "get": function (req, res, next) {
                console.log('ohai')
                res.render('menu-item.ejs', {
                    foo: 'bar'
                });
            }
        },
    };
};
