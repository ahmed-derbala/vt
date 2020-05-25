const appRootPath = require('app-root-path');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const prefs = require(`${appRootPath}/config/prefs`)
const clearance = require(`${appRootPath}/utils/clearance`)
const errorHandler = require(`${appRootPath}/tools/shared`).errorHandler
var jwt = require('jsonwebtoken');
const colors = require('colors/safe');
var privateKey = require(`${appRootPath}/config/secrets`).privateKey;
const signOptions = require(`${appRootPath}/config/prefs`).signOptions
const msg_UserNotFound = require(`${appRootPath}/messages/user_messages`).msg_UserNotFound
const userNREmails = require(`${appRootPath}/nremails/user_nremails`)

exports.signup = async (req, res, next) => {
    //we need clearance to process signup
    if (req.body.code) {
        let invitation = await models.Invitation.findOne({ code: req.body.code }).select({ "targetRole": 1, "_id": 0 }).lean()
        req.body.clearance = clearance[invitation.targetRole]
    }
    if (!req.body.clearance) {
        req.body.clearance = clearance.USER
    }

    //ccreating account for super user
    if (req.body.clearance == 'SUPER') {
        return models.User.find({
            "clearance.title":
                clearance.SUPER.title
        })
            .then(supers => {
                if (supers.length < clearance.SUPER.max) {
                    //registering a super if we did not reach the max
                    return bcryptjs.hash(req.body.password, saltRounds, function (err, hash) {
                        if (err) {
                            log().error({ message: err, route: req.originalUrl, ip: req.ip, userAgent: req.headers["user-agent"] })
                            return res.status(523).send('operation error');
                        }

                        req.body.password = hash;
                        //user language
                        if (req.headers["accept-language"]) {
                            req.body.lang = req.headers["accept-language"].slice(0, 2)
                        } else {
                            req.body.lang = prefs.defaultLang
                        }
                        req.body.clearance = clearance.SUPER

                        return models.User.create(req.body, function (err, createdUser) {
                            if (err) {
                                return errorHandler(err, req, res, next)
                            }
                            createdUser = JSON.parse(JSON.stringify(createdUser));
                            delete createdUser.password;
                            log().verbose({ message: `new user created`, createdUser });
                            return res.redirect('/user/signin')
                        })
                    })
                } else {
                    return res.status(403).send(`max number of supers reached`)
                }
            })
    }
    //registering NON SUPER user
    return bcryptjs.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
            log().error({ message: err, route: req.originalUrl, ip: req.ip, userAgent: req.headers["user-agent"] })
            return res.status(523).send('operation error');
        }

        req.body.password = hash;
        //user language
        if (req.headers["accept-language"]) {
            req.body.lang = req.headers["accept-language"].slice(0, 2)
        } else {
            req.body.lang = prefs.defaultLang
        }

        return models.User.create(req.body, function (err, createdUser) {
            if (err) {
                return errorHandler(err, req, res, next)
            }
            createdUser = JSON.parse(JSON.stringify(createdUser));
            delete createdUser.password;
            log().verbose({ message: `new user created`, createdUser });
            return res.redirect('/user/signin')
        })
    })
}

/**
 * USER SIGNIN
 */
exports.signin = (req, res, next) => {
    return models.User.findOne({ $or: [{ email: req.body.email }] }).select("+password")
        .then(user => {
            if (user == null) {
                log().debug({ message: `login=${req.body.login} not found`, route: req.originalUrl, ip: req.ip, userAgent: req.headers["user-agent"] });
                return res.status(404).send('no user found with ' + req.body.email)
            }

            //decrypt password
            return bcryptjs.compare(req.body.password, user.password, function (err, result) {
                if (err) {
                    log().debug({ message: `[BCRYPTJS_ERROR] ${err}` });
                    return res.status(523).send('operation error')
                }
                //if passwords match
                if (result) {
                    //delete user.dataValues.password;
                    //generating token for logged in user
                    //signing token
                    let newUser = JSON.parse(JSON.stringify(user));
                    delete newUser.password;
                    return jwt.sign({
                        user: newUser,
                        auth: {
                            ip: req.connection.remoteAddress,
                            userAgent: req.headers["user-agent"]
                        }
                    }, privateKey, signOptions, function (err, token) {
                        if (err) {
                            log().verbose({ message: err });
                            return res.status(523).send('operation error');
                        }
                        //token generated successfully
                        //attaching generated token to user object, we need to parse mongooe document   
                        newUser.token = token;
                        //saving current session data
                        return models.Session.create({
                            UserId: user._id,
                            email: user.email,
                            attempt: 0,
                            ip: req.ip,
                            userAgent: req.headers["user-agent"],
                            token,
                        }, function (err, session) {
                            if (err) {
                                return errorHandler(err, req, res, next)
                            }
                            //everything is ok, send back user object
                            log(user._id).verbose({ message: `${user.email} loggedIn`, route: req.originalUrl, ip: req.ip, userAgent: req.headers["user-agent"] })
                            // return res.status(200).send(newUser);
                            res.cookie('token', token)
                            return res.redirect('/')
                        })
                    });
                    //end generating token for logged in userr  
                } else {
                    //incorrect password
                    return models.Session.findOne({ UserId: user._id }, function (err, session) {
                        if (err) {
                            return errorHandler(err, req, res, next)
                        }
                        //wrong credentials for first time (empty session for that user)
                        if (!session) {
                            return models.Session.create({
                                UserId: user._id,
                                email: user.email,
                                attempt: 0,
                                ip: req.ip,
                                userAgent: req.headers["user-agent"],
                                token: null,
                            }, function (err, session) {
                                if (err) {
                                    return errorHandler(err, req, res, next)
                                }
                                //everything is ok, send back user object
                                log(user._id).verbose({ message: `${user.email} loggedIn`, route: req.originalUrl, ip: req.ip, userAgent: req.headers["user-agent"] })
                                // return res.status(200).send(newUser);
                                return res.redirect('/user/signin')

                            })
                        }
                        //saving current session data
                        return models.Session({
                            UserId: user._id,
                            email: user.email,
                            attempt: session.attempt++,
                            ip: req.ip,
                            userAgent: req.headers["user-agent"],
                        })
                            .save((err, session) => {
                                return res.status(401).send('wrong password')
                            })
                    })
                }
            })
        })
}

/**
 * UPDATE PROFILE
 */
exports.update = (req, res, next) => {
    /*console.log('update controlelr');
    console.log(req.body);*/
    return models.User.updateOne({ _id: req.user._id }, req.body,
        function (updateErr, numberAffected, rawResponse) {
            if (updateErr) {
                return console.log(updateErr);
            }
            log(req.user._id).verbose({ label: 'SUCCESS', message: `${req.user.email} updated answer of question ${req.params.questionId} in the ongoingAssessment` })
            return res.status(200).send(`user updated`)
        })

}

/**
 * USER SIGN OUT
 */
exports.signout = (req, res, next) => {
    return models.Session.deleteOne({ token: req.cookies.token }, function (err) {
        if (err) {
            return errorHandler(err, req, res, next)
        }
        //destroying all cookies
        for (var prop in req.cookies) {
            if (!req.cookies.hasOwnProperty(prop)) {
                continue;
            }
            res.cookie(prop, '', { expires: new Date(0) });
        }
        return res.redirect('/')
    })
}