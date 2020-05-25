/**
 * this file contains messages (outputs to user) based on language
 */

const packagejson = require('../package.json');

exports.webPageNotFound = (lang) => {
    if (lang == 'fr') {
        return `Desole, cette page est introuvable.`
    }
    else if (lang == 'ar') {
        return `arabic`
    }
    else {
        return `Sorry, page not found.`
    }
}


exports.internalServerError = (lang) => {
    if (lang == 'fr') {
        return `Desole, erreur interne du serveur. L'equipe ${packagejson.name} est notifie`
    }
    else if (lang == 'ar') {
        return `arabic`
    }
    else {
        return `Sorry, internal server error. ${packagejson.name} is notified`
    }
}