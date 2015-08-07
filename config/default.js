//Default configs
module.exports = {

    "app": {

        "name": "online-cuisine",

        "description": "Restaurant Online Ordering App",

        "url": "http://online-cuisine.com",

        "fromEmail": "admin@online-cuisine.com",

        "routes": {

            "passport": {
                "authProviders": [
                    "facebook",
                    "google",
                    "local",
                    "twitter",
                    "github"
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
                "companions": "/profile/companions",
                "favorites": "/profile/favorites",
                "orders": "/profile/orders",
                "redirect": {
                    "successRedirect": "/profile"
                }
            },

            "public": {
                "home": "/",
                "menu": "/menu",
                "order": "/order",
                "checkout": "/checkout",
                "payment": "/payment",
                "contact": "contact",
                "deals": "deals",
                "signup": "/signup",
                "login": "/login",
                "logout": "/logout",
                "forgot": "/forgot",
                "reset": "/reset/:resetToken",
                "redirect": {
                    "successRedirect": "/profile"
                }
            }
        }
    }
}
