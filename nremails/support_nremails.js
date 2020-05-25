const appRootPath = require('app-root-path');
const sendNoReplyEmail = require(`${appRootPath}/tools/mailing`).sendNoReplyEmail
var ip = require("ip");
var server = require('../server')
const packagejson = require('../package.json');
const prefs = require(`${appRootPath}/config/prefs`)

exports.email_supportRequest = (support, lang) => {
    if (prefs.emails.send == false && process.env.NODE_ENV != 'production') return false
    let to, subject, html

    if (lang == 'fr') {
        to = receiverEmail
        subject = `Demande d'assistance ${support.kind}`
        html = `Bonjour,
        Une demande d'assistance a ete cree, details: <br><br>
        Recruiter firt name: ${support.User.firstName}<br>
            Recruiter last name: ${support.User.lastName}<br>
            support kind: ${support.kind}<br><br>
            description: ${support.description}
        `
    }

    else {
        to = prefs.emails.support
        subject = `${support.kind} support request`
        html = `Hi,
            a support request has been made, support details: <br><br>
            Recruiter firt name: ${support.User.firstName}<br>
            Recruiter last name: ${support.User.lastName}<br>
            support kind: ${support.kind}<br><br>
            description: ${support.description}
            `
    }
    return sendNoReplyEmail(to, subject, html)
}

//an email sent to a support request user
exports.email_supportResponse = (support, lang) => {
    if (prefs.emails.send == false && process.env.NODE_ENV != 'production') return false
    let to, subject, html

    if (lang == 'fr') {
        to = receiverEmail
        subject = `Reponse a votre demande d'assistance ${support.kind}`
        html = `Bonjour,
        you are invited to signup via this link <br><br>
        ${link}`
    }

    else {
        to = prefs.emails.support
        subject = `${support.kind} Support response`
        html = `Hi,
            a support request has been made, support details: <br><br>
            Recruiter firt name: ${support.User.firstName}<br>
            Recruiter last name: ${support.User.lastName}<br>
            support kind: ${support.kind}<br><br>
            description: ${support.description}`
    }

    return sendNoReplyEmail(to, subject, html)
}