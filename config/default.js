//Default configs
module.exports = {

    "app": {

        "name": "online-cuisine",

        "description": "Restaurant Online Ordering App",

        "url": "http://online-cuisine.com",

        "fromEmail": "admin@online-cuisine.com",

        "routes": {

            "admin": {
                "seed": "/seed/:seedCount"
            },

            "passport": {
                "authProviders": [
                    "facebook",
                    "google",
                    "local",
                    "twitter"
                ],
                "authentication": "/auth/:provider",
                "authorization": "/link/:provider",
                "unlinking": "/unlink/:provider",
                "callback": "/auth/:provider/callback",
                "redirect": {
                    "successRedirect": "/profile",
                    "failureRedirect": "/"
                }
            },

            "protected": {
                "profile": "/profile",
                "link": "/profile/link",
                "addresses": "/profile/addresses",
                "address": "/profile/address/:addressId",//for edit
                "addressDelete": "/profile/address/:addressId/delete",//for delete
                "companions": "/profile/companions",
                "companion": "/profile/companion/:companionId/delete",//for delete
                "favorites": "/profile/favorites",
                "favorite": "/profile/favorite/:favoriteId/delete",//for delete
                "orders": "/profile/orders",
                "redirect": {
                    "successRedirect": "/profile"
                }
            },

            "public": {
                "home": "/",
                "contact": "/contact",
                "deals": "/deals",
                "signup": "/signup",
                "login": "/login",
                "logout": "/logout",
                "forgot": "/forgot",
                "reset": "/reset/:resetToken",
                "redirect": {
                    "successRedirect": "/profile"
                }
            },

            "menu": {
                "menu": "/menu",
                "menuItem": "/menu/:itemId",
            },

            "order": {
                "order": "/order",
                "orderItem": "/order/:orderItemId",
                "removeItem": "/order/:orderItemId/remove"
            },

            "checkout": {
                "checkout": "/checkout",
                "payment": "/payment"
            }
        }
    }
}
