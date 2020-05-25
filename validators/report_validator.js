const appRootPath = require('app-root-path');
const { check } = require('express-validator');
const emailMessages = require(`${appRootPath}/messages/email_messages`)
const prefs = require(`${appRootPath}/config/prefs`)
const keepFromJson = require(`${appRootPath}/tools/shared`).keepFromJson

exports.create = [
    check('title').exists(),
    check('description').exists()
];


exports.signin = [
    check('email').isEmail().withMessage(emailMessages.invalidEmail(prefs.defaultLang)),
    check('password').exists()
];

exports.resetPassword = [
    check('email').isEmail().withMessage(emailMessages.invalidEmail(prefs.defaultLang)),
];

exports.update = function (req, res, next) {
    /*[
        check('email').isEmail().withMessage(emailMessages.invalidEmail(prefs.defaultLang)),
    ]*/
    req.body = keepFromJson(req.body,['email'])
    next()
}

exports.update2 = 
    [
        check('email').isEmail().withMessage(emailMessages.invalidEmail(prefs.defaultLang)),
    ]
