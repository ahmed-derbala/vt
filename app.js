/**
 * mainly we load modules and express routes
 */
const appRootPath = require('app-root-path');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var auth = require('./utils/auth') //Middleware
var cors = require('cors');
const swaggerDocument = require(`${appRootPath}/docs/swagger`)
const swaggerUi = require("swagger-ui-express");
const expressEjsLayouts = require('express-ejs-layouts')
const errorMessages = require(`${appRootPath}/messages/error_messages`)
const prefs = require(`${appRootPath}/config/prefs`);
var createError = require('http-errors');



var app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //load static files under /public

/**
 * view engine
 */
app.use(expressEjsLayouts)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * LOADERS, colors and appRootPath already loaded in server.js
 */
global.log = require(`${appRootPath}/utils/log`).log //loading log module
global.errorHandler = require(`${appRootPath}/tools/shared`).errorHandler //loading log module
require(`${appRootPath}/utils/db`) //loading db connection
global.models = require('./models') //loading models
/**
 * display extra informations on terminal and calculate response time on production and testing envirements
 * must be before loading routes
 */
if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'local') {
    app.use(logger(`:status :method :url :remote-addr responseTime=[*:response-time*]`, { stream: log.stream }));
} else {
    app.use(logger(`:status :method :url :remote-addr responseTime=[*:response-time*]\n:user-agent`, { stream: log.streamProduction }));
}

/**
 * LOADING ROUTES
 */
app.use(auth.tokenAuth);
for (let r = 0; r < auth.routes.length; r++) {
    //index route
    if (auth.routes[r] == '') {
        app.use(`/${auth.routes[r]}`, require('./routes/index'))
    } else {
        app.use(`/${auth.routes[r]}`, require('./routes/' + auth.routes[r] + '_route'))
    }
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

/**
 * web page redirection if error
 */
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    //res.status(err.status || 500);    
    log().debug({ label: '404_NOT_FOUND', message: `${req.method} ${req.url} not found` })
    if (err.status && err.status == 404) {
        //errorHandler(errorMessages.webPageNotFound(prefs.defaultLang), req, res, next)
        res.status(404).render('error', { message: errorMessages.webPageNotFound(prefs.defaultLang), connectedUser: req.user })
    } else {
        if (process.env.NODE_ENV == 'production') {
            log().error({ label: 'ERROR', message: err })
            errorHandler(errorMessages.internalServerError(prefs.defaultLang), req, res, next)
        } else {
            res.render('error', { message: err, connectedUser: req.user })
        }
    }
});

/**
 * api documentation
 */
app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
x = "ES6"


//used for js on views
var moment = require('moment');
var shortDateFormat = "DD-MM-YYYY";
app.locals.moment = moment;
app.locals.shortDateFormat = shortDateFormat;

module.exports = app;
