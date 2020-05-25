const appRootPath = require('app-root-path');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const prefs = require(`${appRootPath}/config/prefs`)
const clearance = require(`${appRootPath}/utils/clearance`)
const errorHandler = require(`${appRootPath}/tools/shared`).errorHandler
const roles = require(`${appRootPath}/utils/clearance`).roles
const invitationKinds = require(`${appRootPath}/models/invitation`).kinds
const shortid = require("shortid");
const email_signupInvitation = require(`${appRootPath}/nremails/user_nremails`).email_signupInvitation

exports.create = async (req, res, next) => {
    
    //make sure the provided role is valid
    if (!roles.includes(req.body.targetRole)) {
        return res.status(422).send(`invalid targetRole`)
    }

    req.body.InviterId = req.user._id
    req.body.code = shortid.generate() //unique code for invitation link

        //upneserverw
        await models.Invitation.create(req.body, function (err, invitation) {
            if (err) {
                log().error({ label: 'ERROR', message: err })
                return errorHandler(err, req, res, next)
            }

            log().verbose({ label: 'SUCCESS', message: `Invitation created with code ${req.body.code}` });
            //sending email
                req.body.clearance = clearance[req.body.targetRole]
                //req.body.password = "123"
                email_signupInvitation(req.body.email, `${prefs.frontBaseUrl}invitation/${req.body.code}`, req.user.lang)
            
        });
        //}
        //return res.status(200).send(`invitation are processing, code=${req.body.code}`)
        return res.render('success',{message:`invitation are processing, code=${req.body.code}`,connectedUser:req.user})

    
}

exports.link = (req, res, next) => {
    return models.Invitation.findOne({ code: req.params.id }, function (err, invitation) {
        if (err) {
            return errorHandler(err, req, res, next)
        }

        if (!invitation) {
            return res.status(401).send(`you can't signup with an invalid invitation code`)
        }

        req.body.InvitationId = invitation._id
        return bcryptjs.hash(req.body.password, saltRounds, async function (err, hash) {
            if (err) {
                log().error({ message: err, route: req.originalUrl, ip: req.ip, userAgent: req.headers["user-agent"] })
                return res.status(523).send('operation error');
            }

            req.body.password = hash;
            //user language
            if (req.headers["accept-language"]) {
                req.body.lang = req.headers["accept-language"].slice(0, 2)
            } else {
                req.body.lang = prefs.defaultLang
            }

            //permissions
            req.body.clearance = clearance[invitation.targetRole]
            req.body.email = invitation.email
            req.body.ongoingAssessment = invitation.Campaign.Assessment
            //checking if user already created an account
            return models.User.findOne({ email: req.body.email }, function (err, fetchedUser) {
                if (err) {
                    return errorHandler(err, req, res, next)
                }
                if (fetchedUser) {
                    //the link clicked more than one time, the user already created
                    return res.status(200).send(fetchedUser)
                } else {
                    return models.User.create(req.body, function (err, userToCreate) {
                        if (err) {
                            //return res.status(200).send('user already registered, redirection to the ongoiing assessement')
                            return errorHandler(err, req, res, next)
                        }

                        userToCreate = JSON.parse(JSON.stringify(userToCreate));
                        delete userToCreate.password;
                        log().verbose({ message: `new user created`, userToCreate });
                        //disabling invitation
                        models.Invitation.updateOne({ _id: invitation._id }, { passwordSet: true },
                            function (updateErr, numberAffected, rawResponse) {
                                if (updateErr) {
                                    return console.log(updateErr);
                                }
                                else {
                                    console.log(`invite updated`);
                                }
                            })
                        return res.status(201).send(userToCreate)
                    })
                }
            })
            //})
        });
    })
}

