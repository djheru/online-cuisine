// Application file

//globals are bad, mmkay? =================================
global.appGlobals   = {};
appGlobals.config   = require('./config')(process.env.NODE_ENV);
appGlobals.logger   =  require('./app/services/logger');

// set up =================================================
var fs              = require('fs'); // Filesystem
var uuid            = require('uuid'); //uuid
var express         = require('express'); // express
var session         = require('express-session'); // sessions
var app             = express(); // instantiate express
var port            = process.env.NODE_PORT || 3000; //Service listening here
var mongoose        = require('mongoose'); //Mongodb ORM
var RedisStore      = require('connect-redis')(session); // Redis for persistent sessions
var middleware      = require('./app/routes/middleware') // Custom Middleware
var passport        = require('passport'); // Passport for federated login
var flash           = require('express-flash'); // Pass messages in the request
var morgan          = require('morgan'); // Logging
var cookieParser    = require('cookie-parser'); //Parse cookie data
var bodyParser      = require('body-parser'); //parse body data
var multer          = require('multer'); //upload handling
var csrf            = require('csurf'); //Prevent CSRF in forms
var validator       = require('express-validator'); //Validate forms
var _               = require('underscore'); //JS utility library

// mongoose ===============================================
mongoose.connect(appGlobals.config.get('database').url);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error: '));
conn.once('open', function(){
    appGlobals.logger.info('connected to mongodb at ' + appGlobals.config.get('database').url);
});

//models ==================================================
var models = require('./app/models');

// pass passport for configuration ========================
require('./app/services/passport')(passport, models);

// set us up express ======================================
//logging
var logConfig = {
    stream: fs.createWriteStream(
        appGlobals.config.get("logger").expressFilename,
        {'flags': 'w'}
    )//write to file
};
app.use(morgan(appGlobals.config.get("logger").format, logConfig));

//express middleware ======================================
app.use(cookieParser()); // read cookies
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(validator({
    customValidators: middleware.customValidators
}));
app.set('view engine', 'ejs'); // templating
app.use(middleware.templateHelpers);

// integrate with passport
app.use(session({
    secret: 'keyboardcatmeow',
    maxAge: new Date(Date.now() + 3600000),
    store: new RedisStore(),
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());

// persistent login sessions
app.use(passport.session());

//store the user and config in res.locals
app.use(function (req, res, next) {
    res.locals.user = (req.isAuthenticated()) ? req.user : false;
    res.locals.config = appGlobals.config.get("app");
    return next();
});

// use connect-flash for flash messages in the session
app.use(flash());
app.use(middleware.flashAlert);
app.use(middleware.flashForm);
app.use(middleware.flashBody);

//Serve static files
//app.use(express.static('public', {maxAge: 86400000}));


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/original/');
    },
    filename: function (req, file, cb) {
        var ext = (file.mimetype == 'image/jpeg') ? 'jpg' : 'png',
            fileName = req.user.id + '-' + Date.now() + '-' + uuid.v4() + '.' + ext;
        req.body[file.fieldname]['fileName'] = fileName;
        cb(null, fileName);
    }
});
var fileFilter = function (req, file, cb) {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        req.body[file.fieldname] = file;
        cb(null, true);
    } else {
        cb(new Error('Only .jpg or .png files are allowed'));
    }
};
var limits = {
    fileSize: 10 * 1024 * 1024
};
var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});
app.use(upload.single('fileName'));

//csrf protection
app.use(csrf());
app.use(middleware.csrfChecker);

// routes =================================================
//get the routes object as an array of routes
var routes = require('./app/routes')(express, passport);
app.use('/', routes.public);
app.use('/', routes.passport);
app.use('/', routes.protected);

//catch errors ============================================
app.use(middleware.logErrors);
app.use(middleware.errorHandler);

//seeding =================================================
app.use(middleware.seed);

// start the app ==========================================
console.log('Starting app on port ' + port);
app.listen(port, function(){
    appGlobals.logger.info('Starting app on port ' + port);
    appGlobals.logger.info('NODE_ENV: ', app.get('env'));
});

//for testing
module.exports = app;
