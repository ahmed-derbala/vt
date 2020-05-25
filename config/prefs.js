/**
 * The project settings, you dont need to look elsewhere to configure the project!
 */
const appRootPath = require('app-root-path');
const packagejson = require('../package.json');
const server = require('../server')
const numbers = require(`${appRootPath}/tools/numbers_tools`)

/**
 * default values for local or undefined mode
 */
let httpMode = 'http'
const backPort = numbers.normalizePort(process.env.PORT || '3003');
const frontPort = backPort
let frontBaseUrl = `${httpMode}://${server.ip}:${backPort}/`
let backBaseUrl = `${httpMode}://${server.ip}:${backPort}/`
let noreplyEmail = 'ahmed.nremail@gmail.com'
let db = {}
db.url = '127.0.0.1'
db.name = packagejson.name
//db.uri = `mongodb+srv://user1:123@cluster0-djizf.mongodb.net/test?retryWrites=true&w=majority`
db.uri = `mongodb://${db.url}/${db.name}`
let pagination = {}
pagination.limit = 2 // easy for fast testing
let cluster = 0 // all or half or 0 to turn off, if the number > cpuNumber, the cpuNumber will be used
let socketio = {
    enable: true
}

/**
 * values for development mode
 */
if (process.env.NODE_ENV == 'development') {
    // keep emtpty to apply local mode values
}


/**
 * values for testing mode
 */
if (process.env.NODE_ENV == 'testing') {
    // keep emtpty to apply local mode values

}


/**
 * values for production mode
 */
if (process.env.NODE_ENV == 'production') {
    frontBaseUrl = `${httpMode}://${packagejson.name}.herokuapp.com`
    backBaseUrl = `${httpMode}://${packagejson.name}.herokuapp.com`
    // noreplyEmail = `noreply@${packagejson.name}.com`
    if (!process.env.MONGO_URI) {
        db.name = db.name.concat('_prod_heroku')
        db.uri = `mongodb+srv://user1:123@cluster0-djizf.mongodb.net/${db.name}?retryWrites=true&w=majority`
    } else {
        db.name = db.name.concat('_prod')
        db.uri = process.env.MONGO_URI
    }
    pagination.limit = 10
    cluster = 'all'
    socketio = {
        enable: true
    }
}
module.exports = {
    "company": {
        "name": "ahmed-derbala",
        "url": "https://www.linkedin.com/in/ahmed-derbala/",
        "description": "senior nodejs developer",
        "phone": "00216 26 437 513",
        "email": "ahmed.derbala@esprit.tn",
        "address": "Tunisia",
        "logo": "<img src='https://media-exp1.licdn.com/dms/image/C5603AQEFuqMs1MBSrA/profile-displayphoto-shrink_200_200/0?e=1593648000&v=beta&t=_rwywMc4FTO18dbL_hLBTcDN-YmaX3cb_oGprgAVK4k' alt='logo'>"
    },
    db,
    "signOptions": {
        "issuer": "ahmed-derbala",
        "subject": packagejson.name,
        "audience": "all",
        "expiresIn": "30 days",
        "algorithm": "HS256"
    },
    "emails": {
        "send": false,//send log emails on development mode, by default log emails are sent only in testing and production mode
        "host": "smtp.gmail.com",
        "port": 587,
        "verificationOnRegister": false,//true means when a user register an account it will not be activated unless the user click the link sent to his email
        "noreply": noreplyEmail,
        "error": "ahmed.derbala@esprit.tn",
        "warn": "ahmed.derbala@esprit.tn",
        "info": "ahmed.derbala@esprit.tn",
        "developer": "ahmed.derbala@esprit.tn",
        "support": "ahmed.derbala@esprit.tn"
    },
    httpMode,
    backPort,
    frontPort,
    frontBaseUrl,
    backBaseUrl,
    "responseTimeAlert": 20000,//number in milliseconds, if a request takes longer time than this value, a warn email will be sent
    "defaultLang": "en",
    "systemWarnings": true, //prefer to send or not some warnings on production like  and responseTimeAlert
    "judge0": {
        "submissions": "http://127.0.0.1:3000/submissions/?base64_encoded=false&wait=true"
    },
    pagination,
    cluster,
    socketio
}

