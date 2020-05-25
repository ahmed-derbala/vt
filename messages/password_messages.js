exports.invalid = (lang) => {
    if (lang == 'fr') {
        return `Mot de passe invalide`
    }
    else  {
        return `Invalid password`
    }
}

exports.generated = (user, lang) => {
    if (!lang || lang == 'en') {
        return `Hi ${user.firstName} ${user.lastName}, a new password was generated successfully and sent to your inbox`
    }
    if (lang == 'fr') {
        return `Bonjour ${user.firstName} ${user.lastName}, un nouveau mot de passe est genere et envoye a votre inbox`
    }
}