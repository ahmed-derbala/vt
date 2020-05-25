const appRootPath = require('app-root-path');
const { check } = require('express-validator');
const emailMessages = require(`${appRootPath}/messages/email_messages`)
const prefs = require(`${appRootPath}/config/prefs`)



exports.reset = [
    check('email').isEmail().withMessage(emailMessages.invalidEmail(prefs.defaultLang)),
];