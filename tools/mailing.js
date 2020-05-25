const appRootPath = require('app-root-path');
const prefs = require(`${appRootPath}/config/prefs`)
const nodemailer = require("nodemailer");
const secrets = require(`${appRootPath}/config/secrets`)
const packagejson = require('../package.json');
const colors = require('colors/safe');



var emailSignature = exports.emailSignature = `<br><br>------------------------ ${prefs.company.name} ------------------------<br><br>
${prefs.company.description} <br>
phone: ${prefs.company.phone} <br>
email: ${prefs.company.email}<br>
address: ${prefs.company.address}<br><br>
${prefs.company.logo}`

exports.sendNoReplyEmail = (to, subject, html) => {
    let transporter = nodemailer.createTransport({
        host: prefs.emails.host,
        port: prefs.emails.port,//587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: prefs.emails.noreply,
            pass: secrets.noreplyPassword
        }
    });
    return transporter.sendMail({
        from: packagejson.name + '  <' + prefs.emails.noreply + '>',
        to, subject, html: `${html} ${emailSignature}`
    }, (error, info) => {
        if (error) {
            log().error({ route: colors.bgRed('[tools.sendNoReplyEmail]'), message: error.message });
        } else {
            if (process.env.NODE_ENV == 'production') {
                log().verbose({ message: colors.bgGray(`[NOREPLY_EMAIL] ${to}, ${subject}`), info });
            } else {
                log().verbose({ message: colors.bgGray(`[NOREPLY_EMAIL] ${to}, ${subject}`) });
            }
        }
    });
}