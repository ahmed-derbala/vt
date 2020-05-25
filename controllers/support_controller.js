const appRootPath = require('app-root-path');
const prefs = require(`${appRootPath}/config/prefs`)
const clearance = require(`${appRootPath}/utils/clearance`)
const errorHandler = require(`${appRootPath}/tools/shared`).errorHandler
const asyncForEach = require(`${appRootPath}/tools/shared`).asyncForEach
const durationOfDatesInMinutes = require(`${appRootPath}/tools/dates`).durationOfDatesInMinutes
const email_supportRequest = require(`${appRootPath}/nremails/support_nremails`).email_supportRequest
const email_supportResponse = require(`${appRootPath}/nremails/support_nremails`).email_supportResponse



exports.request = (req, res, next) => {
  req.body.User = req.user
  return models.Support.create(req.body, function (err, support) {
    if (err) {
      return errorHandler(err, req, res, next)
    }
    email_supportRequest(support, req.user.lang)
    return res.status(200).send(support)

  })
}

//a member of the support team respond to a support request
exports.respond = (req, res, next) => {
  return models.Support.findOneAndUpdate({ _id: req.params.id },req.body, function (err, support) {
      //console.log(err);
      //console.log(support);

      if (err) {
        log().error({ label: 'ERROR', message: `support update error`, route: req.originalUrl })
        return errorHandler(err, req, res, next)
      }
      else {
        email_supportResponse(support,support.User.lang)
        return res.status(200).send('success')
      }
    })
}