/**
 * this file contains standard emails sent by server, lang is language choosen by the user
 */
const appRootPath = require('app-root-path');
const sendNoReplyEmail = require(`${appRootPath}/tools/mailing`).sendNoReplyEmail
var ip = require("ip");
var server = require('../server')
const packagejson = require('../package.json');
const prefs = require(`${appRootPath}/config/prefs`)


exports.failedLoginAttempt = (user, req, lang) => {
    if (prefs.emails.send == false && process.env.NODE_ENV != 'production') return false
    if (!lang || lang == 'en') {

        sendNoReplyEmail(user.email, '3 failed login attempts',
            'Hi ' + user.firstName + ' ' + user.lastName + '<br>' +
            'your ' + packagejson.name + ' account had 3 failed login attempts <br>' +
            'ip: ' + req.ip + '<br>' +
            'browser: ' + req.headers["user-agent"] + '<br>' +
            'date: ' + Date(Date.now()))
    }

}

exports.invalidTokenLoginAttempt = (user, req, lang) => {
    if (prefs.emails.send == false && process.env.NODE_ENV != 'production') return false
    if (!lang || lang == 'en') {

        let to = user.email;
        let subject = 'Usage of old token detected';
        let html =
            `Hi ${user.firstName} ${user.lastName} <br>
                invalid token is a token of loggedout or password changed sessions <br>
                we detected that an invalid token of your ${packagejson.name} account has been used <br>
                you should take steps to secure your device <br><br>
                ip: ${req.ip} <br>
                browser: ${req.headers["user-agent"]} <br>
                date: ${Date(Date.now())}`
        sendNoReplyEmail(to, subject, html)
    }
}

exports.invalidSocketTokenLoginAttempt = (user, userAgent, ip, lang) => {
    if (prefs.emails.send == false && process.env.NODE_ENV != 'production') return false
    if (!lang || lang == 'en') {

        let to = user.email;
        let subject = 'Login attempt with old token detected';
        let html =
            `Hi ${user.firstName} ${user.lastName} <br>
                invalid token is a token of loggedout or password changed session <br>
                we detected a login attempt with invalid token to your ${packagejson.name} account <br>
                you should take steps to secure your device <br><br>
                ip: ${ip} <br>
                browser: ${userAgent} <br>
                date: ${Date(Date.now())}`
        sendNoReplyEmail(to, subject, html)
    }
}






exports.emailChanged = (user, req, lang) => {
    if (prefs.emails.send == false && process.env.NODE_ENV != 'production') return false
    if (!lang || lang == 'en') {

        sendNoReplyEmail(user.email, 'Your email is changed',
            'Hi ' + user.firstName + ' ' + user.lastName + '<br>' +
            'your ' + packagejson.name + ' email has been changed <br>' +
            'ip: ' + req.ip + '<br>' +
            'browser: ' + req.headers["user-agent"] + '<br>' +
            'date: ' + Date(Date.now()))
    }

}

exports.verificationOnRegiser = (token, req, lang) => {

    if (!lang || lang == 'en') {
        sendNoReplyEmail(req.body.email, 'Email verification',
            'Hi ' + req.body.firstName + ' ' + req.body.lastName + '<br>' +
            'a ' + packagejson.name + ' user account has been created with this email <br>' +
            'please click the following link to verify the email <br><br>' +
            ip.address() + ':' + prefs.backPort + '/user/emailVerification/' + token + '<br><br>' +
            'ip: ' + req.ip + '<br>' +
            'browser: ' + req.headers["user-agent"] + '<br>' +
            'date: ' + Date(Date.now()))
    }

}






exports.email_signupInvitation = (receiverEmail, link, lang) => {
    if (prefs.emails.send == false && process.env.NODE_ENV != 'production') return false
    let to, subject, html
    
    if (lang == 'fr') {
        to = receiverEmail
        subject = `Invitation to create new account`
        html = `Hi,
        you are invited to signup via this link <br><br>
        ${link}`
    }

    else {
        to = receiverEmail
        subject = `Invitation to create new account`
        html = `Hi,
            you are invited to signup via this link <br><br>
            ${link}`
    }
    return sendNoReplyEmail(to, subject, html)

}