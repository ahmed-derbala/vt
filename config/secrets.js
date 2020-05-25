/**
 * passwords
 */

const packagejson = require('../package.json');

let noreplyPassword = 'nremail123'

if (process.env.NODE_ENV == 'production') {
   // noreplyPassword = process.env.PASSWORD_NOREPLYEMAIL
}

module.exports = {
    "privateKey": `ahmed${packagejson.name}`,
    "noreplyPassword": noreplyPassword
}