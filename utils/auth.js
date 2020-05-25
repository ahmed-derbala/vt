
const appRootPath = require('app-root-path');
var jwt = require('jsonwebtoken');
const privateKey = require(`${appRootPath}/config/secrets`).privateKey;
const deleteFromJson = require(`${appRootPath}/tools/shared`).deleteFromJson
const invalidTokenLoginAttempt = require(`${appRootPath}/nremails/user_nremails`).invalidTokenLoginAttempt
const colors = require('colors/safe');
const fs = require('fs');
var path = require('path');
const roles = require(`${appRootPath}/utils/clearance`).roles

//fetching routes
let routes = [] //urlBaseName of working routes
fs.readdirSync(`${appRootPath}/routes`).forEach(function (file) {
    if (file != 'index.js')
        routes.push(file.substr(0, file.lastIndexOf('_route.')))
});
routes.push('') // home route '/'
exports.routes = routes

exports.tokenAuth = (req, res, next) => {
    //make sure these attributes are not sent on the body
    req.body = deleteFromJson(req.body, ['_id', '__v', 'isDeleted', 'isActive', 'createdAt', 'updatedAt'])
    //routes that bypass token auth        
    let urlBaseName = req.url.slice(req.url.indexOf('/') + 1, req.url.length)
    urlBaseName = urlBaseName.slice(0, urlBaseName.indexOf('/'))

    let routesToIgnore = [
        `/user/signin`,
        `/user/signup`,
        `/user/emailVerification`,
    ]
    //all routes containing these url base name will be ignored
    let urlBaseNameToIgnore = ['testing', 'clearance', 'invite', 'password']
    let urlNotToIgnore = ['/game/all/notPublic', 'invite', 'password']


    if (!routes.includes(urlBaseName) || routesToIgnore.includes(req.url) || urlBaseNameToIgnore.includes(urlBaseName)) {
        next();
        return null //to supress a warning
    } else {
        //we check header and cookies for token
        if (!req.headers.token && req.cookies.token) {
            req.headers.token = req.cookies.token
        }
        if (req.headers.token) {
            //decoding token
            return jwt.verify(req.headers.token, privateKey, function (err, decoded) {
                if (err) {
                    log().warn({ message: err, route: req.originalUrl, ip: req.ip, userAgent: req.headers["user-agent"], token: req.headers.token });
                    if (process.env.NODE_ENV == 'production')
                        return res.status(401).send('token error')
                    //return res.status(401).send(err)
                    //clear cookies
                    for (var prop in req.cookies) {
                        if (!req.cookies.hasOwnProperty(prop)) {
                            continue;
                        }
                        res.cookie(prop, '', { expires: new Date(0) });
                    }
                    return res.redirect('/')
                } else {
                    if (!decoded.user) {
                        log().error({ message: `[TOKEN_DOESNT_HAVE_USER_OBJECT]`, route: req.originalUrl, ip: req.ip, userAgent: req.headers["user-agent"], token: req.headers.token })
                        if (process.env.NODE_ENV == 'production')
                            return res.render('user/user_signin')

                        //return res.status(401).send('token error')
                        //return res.status(401).send('[TOKEN_DOESNT_HAVE_USER_OBJECT]');
                        return res.render('user/user_signin', { message: '[TOKEN_DOESNT_HAVE_USER_OBJECT]' })

                    }
                    //if token exist in session table so its valid, else its not
                    return models.Session.findOne({ token: req.headers.token })
                        .then(session => {
                            if (session != null) {
                                //when testing on local machine there is a confusion in ip address
                                // console.log(req.connection.remoteAddress);
                                //console.log(decoded.auth.ip);
                                //if (((req.connection.remoteAddress == decoded.auth.ip) && (req.headers["user-agent"] == decoded.auth.userAgent)) || process.env.NODE_ENV == 'local') {
                                //if ((req.connection.remoteAddress == decoded.auth.ip) || process.env.NODE_ENV == 'local') {
                                if ((req.ip == decoded.auth.ip) || process.env.NODE_ENV == 'local' || process.env.NODE_ENV == 'production') {
                                    req.user = decoded.user;
                                    //setting values for offset and limit for pagination
                                    if (req.headers.page && parseInt(req.headers.page) >= 1) {
                                        req.limit = 5;
                                        req.offset = (parseInt(req.headers.page) * req.limit) - req.limit;
                                    } else {
                                        req.offset = 0;
                                        req.limit = 1000;
                                    }
                                    next()
                                    return null
                                } else {
                                    log().verbose({ message: `[TOKEN_MISMATCH_SESSION] ${decoded.user.email} user.id=${decoded.user._id}`, route: req.originalUrl, ip: req.ip, userAgent: req.headers["user-agent"], token: req.headers.token })
                                    /*if (process.env.NODE_ENV == 'production')
                                        return res.status(401).send('token error')
                                    return res.status(401).send(`TOKEN_MISMATCH_SESSION`)*/
                                    return res.render('user/user_signin', { message: '[TOKEN_MISMATCH_SESSION]' })

                                }
                            } else {
                                for (var prop in req.cookies) {
                                    if (!req.cookies.hasOwnProperty(prop)) {
                                        continue;
                                    }
                                    res.cookie(prop, '', { expires: new Date(0) });
                                }
                                return res.redirect('/')
                                //token not found in session so its not valid                               
                               // invalidTokenLoginAttempt(decoded.user, req, 'en');
                                log().verbose({ message: `[INVALID_TOKEN] user.email=${decoded.user.email} user.id=${decoded.user._id}`, route: req.originalUrl, ip: req.ip, userAgent: req.headers["user-agent"], token: req.headers.token })
                                /* if (process.env.NODE_ENV == 'production')
                                     //return res.status(401).send('token error')
                                     return res.render('/error',{message: 'token error'})
                                 return res.status(401).send('[INVALID_TOKEN]');*/
                                //return res.render('user/user_signin', { message: '[NO_TINVALID_TOKENOKEN]' })
                                /*clearCookies()
                                return res.redirect('/')*/

                            }
                        })

                }
            });
        } else {
            //no token provided         
            if (!urlNotToIgnore.includes(req.url)) {
                next()
                return null
            }
            //no token on headers
            log().verbose({ message: `[NO_TOKEN]`, route: req.originalUrl, ip: req.ip, userAgent: req.headers["user-agent"] })
            /* if (process.env.NODE_ENV == 'production')
                 return res.status(401).send('token error')
             //return res.status(401).send('[NO_TOKEN]');  */
            return res.render('user/user_signin', { message: '[NO_TOKEN]' })
        }
    }
}

//to verify if a user can access a specefic route
exports.authorize = (permittedRoles, level) => {
    return function (req, res, next) {
        if (permittedRoles) {
            if (!permittedRoles.includes(req.user.clearance.title)) {
                log(req.user._id).verbose({ label: `[ACCESS_DENIED]`, message: `user.email=${req.user.email} route=${req.originalUrl}` })
                // return res.status(403).send('[ACCESS_DENIED]')           
                return res.render('error', { message: '[ACCESS_DENIED]' })
            } else {
                return next()
            }
        }

        else if (level) {
            switch (level.sign) {
                case '>':
                    if (req.user.clearance.level > level.code) {
                        next()
                    } else {
                        log(req.user._id).verbose({ label: `[ACCESS_DENIED]`, message: `user.email=${req.user.email} route=${req.originalUrl}` })
                        return res.render('error', { message: '[ACCESS_DENIED]' })
                    }
                    break;
                case '>=':
                    if (req.user.clearance.level >= level.code) {
                        next()
                    } else {
                        log(req.user._id).verbose({ label: `[ACCESS_DENIED]`, message: `user.email=${req.user.email} route=${req.originalUrl}` })
                        return res.render('error', { message: '[ACCESS_DENIED]' })
                    }
                    break;
                case '<':
                    if (req.user.clearance.level < level.code) {
                        next()
                    } else {
                        log(req.user._id).verbose({ label: `[ACCESS_DENIED]`, message: `user.email=${req.user.email} route=${req.originalUrl}` })
                        return res.render('error', { message: '[ACCESS_DENIED]' })
                    }
                    break;
                case '<=':
                    if (req.user.clearance.level <= level.code) {
                        next()
                    } else {
                        log(req.user._id).verbose({ label: `[ACCESS_DENIED]`, message: `user.email=${req.user.email} route=${req.originalUrl}` })
                        return res.render('error', { message: '[ACCESS_DENIED]' })
                    }
                    break;
                case '=':
                    if (req.user.clearance.level == level.code) {
                        next()
                    } else {
                        log(req.user._id).verbose({ label: `[ACCESS_DENIED]`, message: `user.email=${req.user.email} route=${req.originalUrl}` })
                        return res.render('error', { message: '[ACCESS_DENIED]' })
                    }
                    break;
            }
        }
        else {
            return next()
        }
    }
}
