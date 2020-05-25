const appRootPath = require('app-root-path');
const modelName = require(`${appRootPath}/tools/shared`).modelName(__filename)
const controller = require(`${appRootPath}/controllers/invitation_controller`)
var express = require('express');
var router = express.Router();
const errorHandler = require(`${appRootPath}/tools/shared`).errorHandler
const shortid = require("shortid");
const email_signupInvitation = require(`${appRootPath}/nremails/user_nremails`).email_signupInvitation
const prefs = require(`${appRootPath}/config/prefs`)
const roles = require(`${appRootPath}/utils/clearance`).roles
const invitationKinds = require(`${appRootPath}/models/invitation`).kinds
const clearance = require(`${appRootPath}/utils/clearance`)
const packagejson = require('../package.json');


router.get('/create', (req, res) => {
  res.render('invitation/invitation_create', { appName: packagejson.name, appVersion: packagejson.version, connectedUser: req.user })
});

router.post('/create',
  controller.create
)


router.get('/:id', function (req, res, next) {
  return models.Invitation.findOne({ $or: [{ code: req.params.id }] })
    .then((invitation, err) => {
      if (err) {
        return errorHandler(err, req, res, next)
      }

      if (invitation) {
        if (invitation.active == true) {
          //return res.status(200).send(invitation)
          return res.render('user/user_signup', { code: req.params.id, email: invitation.email,connectedUser: req.user })

        } else {
          //return res.status(404).send(`invitation expired`)
          return res.render('error', { message: 'invitation expired' })
        }
      }
      else {
        //return res.status(204).send('not found or inactive')
        return res.render('error', { message: 'not found or inactive' })

      }
    });
})

module.exports = router;
