/**
 * this file contains standard emails sent by server, lang is language choosen by the user
 */
const appRootPath = require('app-root-path');
const sendNoReplyEmail = require(`${appRootPath}/tools/mailing`).sendNoReplyEmail
var ip = require("ip");
var server = require('../server')
const packagejson = require('../package.json');
const prefs = require(`${appRootPath}/config/prefs`)





exports.changePasswordWarning = (user, req, lang) => {
    //if (env != 'development') {

    if (prefs.emails.send == false && process.env.NODE_ENV != 'production') return false
    if (!lang || lang == 'en') {

        sendNoReplyEmail(user.email, 'Please change password',
            'Hi ' + user.firstName + ' ' + user.lastName + '<br>' +
            'your ' + packagejson.name + ' account had 5 failed login attempts <br>' +
            'we advise you to change your password' +
            'ip: ' + req.ip + '<br>' +
            'browser: ' + req.headers["user-agent"] + '<br>' +
            'date: ' + Date(Date.now()))
    }

}

exports.passwordChanged = (user, req, lang) => {
    //if (env != 'development') {

    if (prefs.emails.send == false && process.env.NODE_ENV != 'production') return false
    if (!lang || lang == 'en') {

        sendNoReplyEmail(user.email, 'Your password is changed',
            'Hi ' + user.firstName + ' ' + user.lastName + '<br>' +
            'your ' + packagejson.name + ' password has been changed <br>' +
            'ip: ' + req.ip + '<br>' +
            'browser: ' + req.headers["user-agent"] + '<br>' +
            'date: ' + Date(Date.now()))
    }

}

exports.reset = (user, req, token, lang) => {
    if (!lang || lang == 'en') {
        let to = user.email

        let subject = `Password reset request`

        let html = `Hi ${user.firstName} ${user.lastName} <br>
            a password reset has been requested for your account.<br>
            If you did not please ignore this email, nothing harmful to your account is done.<br>
            if you already requested a password reset please click the link below and
             be waiting another email having a new generated password<br><br>
            ${prefs.backBaseUrl}api/password/resetValidation/?token=${token}<br><br>

            date: ${Date(Date.now())}<br>
            ip: ${req.ip}<br>
            browser: ${req.headers['user-agent']}`
        return sendNoReplyEmail(to, subject, html)
    }

    if (lang == 'fr') {
        let to = user.email
        let subject = `Demande de reinitialisation du mot de passe `
        let html = `Bonjour ${user.firstName} ${user.lastName} <br>
            On a recu une demande de reinitialisation de mot de passe pour votre compte.<br>
            Si vous n'avez pas fait cette demande, veillez ignorer cet email. votre compte est en securite<br>
            Si vous avez deja fait une demande, veillez cliquer sur le lien en dessous et veillez attendre un autre email contient un nouveau mot de passe genere automatiquement <br><br>
            ${prefs.backBaseUrl}/validatingPasswordReset/?token=${token}<br><br>

            date: ${Date(Date.now())}<br>
            ip: ${req.ip}<br>
            browser: ${req.headers['user-agent']}`
        return sendNoReplyEmail(to, subject, html)
    }
}

exports.resetValidation = (user, generatedpassword, req, lang) => {
    if (!lang || lang == 'en') {
        let to = user.email
        let subject = `Password reset approved`
        let html = `Hi ${user.firstName} ${user.lastName} <br>
            a password reset request has been approved for your account.<br>
            your new password is: ${generatedpassword}<br>
            now try to login with the new password<br><br>
            ${prefs.frontBaseUrl}/#!/login <br><br>

            date: ${Date(Date.now())}<br>
            ip: ${req.ip}<br>
            browser: ${req.headers['user-agent']}`
        return sendNoReplyEmail(to, subject, html)
    }

    if (lang == 'fr') {
        let to = user.email
        let subject = `Reinitialization de mot de passe approuve`
        let html = `Bonjour ${user.firstName} ${user.lastName} <br>
            La reinitialisation du mot de passe pour votre compte est approuve.<br>
            nouveau mot de passe : ${generatedpassword}<br>
            essayez de se connecter maintenent <br><br>
            ${prefs.frontBaseUrl}/#!/login <br><br>

            date: ${Date(Date.now())}<br>
            ip: ${req.ip}<br>
            browser: ${req.headers['user-agent']}`
        return sendNoReplyEmail(to, subject, html)
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






