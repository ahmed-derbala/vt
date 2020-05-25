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
const passwordNREmails = require(`${appRootPath}/nremails/password_nremails`)
const getRandomNumber = require(`${appRootPath}/tools/numbers_tools`).getRandomNumber
const passwordMessages = require(`${appRootPath}/messages/password_messages`)



/**
 * RESET USER PASSWORD
 */
exports.resetPassword = (req, res, next) => {
    return models.User.findOne({ email: req.body.email, isActive: true }, function (err, user) {
        if (err) {
            return errorHandler(err, req, res, next)
        }

        if (!user) {
            log().debug({ message: `${req.body.email} not found or not active`, route: req.originalUrl });
            return res.status(404).send(msg_UserNotFound(req.body.email, prefs.defaultLang))
        }
        //signing token
        return jwt.sign({
            user,
            auth: {
                ip: req.connection.remoteAddress,
                userAgent: req.headers["user-agent"]
            }
        }, privateKey, signOptions, function (err, token) {
            if (err) {
                log().verbose({ message: err });
                return res.status(523).send('operation error');
            }
            passwordNREmails.reset(user, req, token, user.lang)
            log(user.id).verbose({ message: `password reset for email ${req.body.email} user.id=${user.id}`, route: req.originalUrl });
            return res.status(200).send(`password reset request sent to ${user.email}`)
        })
    })
}

/**
 * validating Password Reset
 */
exports.resetValidation = (req, res, next) => {
    //decoding token
    return jwt.verify(req.query.token, privateKey, function (err, decoded) {
        if (err) {
            log().warn({ message: err, route: req.originalUrl, ip: req.ip, userAgent: req.headers["user-agent"] });
            if (process.env.NODE_ENV == 'production')
                return res.status(401).send('token error')
            return res.status(401).send(err)
        } else {
            if (!decoded.user) {
                log().error({ message: `[TOKEN_DOESNT_HAVE_USER_OBJECT]`, route: req.originalUrl, ip: req.ip, userAgent: req.headers["user-agent"], token: req.headers.token })
                if (process.env.NODE_ENV == 'production')
                    return res.status(401).send('token error')
                return res.status(401).send('[TOKEN_DOESNT_HAVE_USER_OBJECT]');
            }
            //token containg valid user object
            return models.User.findOne({ email: decoded.user.email, isActive: true }, function (err, user) {
                if (!user) {
                    log().verbose({ message: `reset password request for non existing or non active user ${req.body.email}`, route: req.originalUrl });
                    return res.status(404).send('no user with email=' + req.body.email)
                }
                //encrypting new password
                let generatedPassword = getRandomNumber(1000, 10000).toString()

                return bcryptjs.hash(generatedPassword, saltRounds, function (
                    err, hash) {
                    if (err) {
                        log().warn({ route: req.originalUrl, message: err })
                        return res.status(523).send('operation error');
                    } else {
                        user.password = hash
                        user.save()
                        passwordNREmails.resetValidation(user, generatedPassword, req, user.lang)
                        log(user._id).verbose({ message: `new password generated for user ${user.email}`, route: req.originalUrl, ip: req.ip, userAgent: req.headers["user-agent"] })
                        return res.status(200).send(passwordMessages.generated(user, user.lang))
                    }
                })
            })
                .catch(err => {
                    log().error({ message: err, route: req.originalUrl });
                    if (process.env.NODE_ENV == 'production')
                        return res.status(522).send('fail');
                    return res.status(522).send(err);
                })
        }
    })
}