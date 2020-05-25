
exports.msg_UserNotFound = (email, lang) => {
    if (!lang || lang == 'en') {
        return `The user with email=${email} not exist or not active`
    }
    if (lang == 'fr') {
        return `L'utilisateur avec email=${email} n'existe pas ou n'est pas active`
    }
}

exports.msg_NewUserRegistered = (user, newUser, lang) => {
    if (!lang || lang == 'en') {
        return `${user.firstName} ${user.lastName} registered ${newUser.firstName} ${newUser.lastName}`
    }
    if (lang == 'fr') {
        return `${user.firstName} ${user.lastName} a cree un compte pour ${newUser.firstName} ${newUser.lastName}`
    }
}





