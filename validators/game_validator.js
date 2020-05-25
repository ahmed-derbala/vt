const appRootPath = require('app-root-path');
const { check } = require('express-validator');
const emailMessages = require(`${appRootPath}/messages/email_messages`)
const prefs = require(`${appRootPath}/config/prefs`)
const keepFromJson = require(`${appRootPath}/tools/shared`).keepFromJson

exports.create = [
    check('title').exists(),
    check('description').exists()
];


exports.search = [
    check('term').exists()
];

exports.resetPassword = [
    check('email').isEmail().withMessage(emailMessages.invalidEmail(prefs.defaultLang)),
];

exports.update = [
    check('_id').exists()
]

