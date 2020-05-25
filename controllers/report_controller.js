const appRootPath = require('app-root-path');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const prefs = require(`${appRootPath}/config/prefs`)
const clearance = require(`${appRootPath}/utils/clearance`)
const errorHandler = require(`${appRootPath}/tools/shared`).errorHandler
var jwt = require('jsonwebtoken');
const colors = require('colors/safe');
var privateKey = require(`${appRootPath}/config/secrets`).privateKey;
const signOptions = require(`${appRootPath}/config/prefs`).signOptions
const msg_UserNotFound = require(`${appRootPath}/messages/user_messages`).msg_UserNotFound
const userNREmails = require(`${appRootPath}/nremails/user_nremails`)
const packagejson = require('../package.json');

exports.create = (req, res, next) => {
    return models.Report.create(req.body, function (err, report) {
        if (err) {
            return errorHandler(err, req, res, next)
        }
        //return res.render('success', { message: 'report success', connectedUser: req.user })
        return res.redirect('/')
    })
}




exports.all = (req, res, next) => {
    const options = {
        page: 1,
        limit: 5,
        lean: true,
        sort: "-updatedAt",
        populate: "gameId"
    };
    return models.Report.paginate({}, options, function (err, result) {
        if (err) {
            return errorHandler(err, req, res, next)
        }
console.log(result)
        return res.render('report/report_all', { reports: result.docs, totalPages: result.totalPages, appName: packagejson.name, appVersion: packagejson.version, connectedUser: req.user, message: null })

    })
}

exports.search = async (req, res, next) => {
    let games = await models.game.find({ $or: [{ title: req.query.term }, { description: req.query.term }] }).lean()
    return res.render('game/game_all', { games })
}


exports.delete = async (req, res, next) => {
    return models.Report.deleteOne({ _id: req.body.id }, function (err) {
        if (err) {
            return errorHandler(err, req, res, next)
        }
        return res.redirect('/report/all')
    })
}

exports.page = async (req, res, next) => {
    const options = {
        page: Math.abs(parseInt(req.query.page)) || 1,
        limit: 5,
        lean: true,
        sort: "-updatedAt",
        populate: "gameId"
    };
    return models.Report.paginate({}, options, function (err, result) {
        if (err) {
            return errorHandler(err, req, res, next)
        } else {
            return res.render('report/report_all', { reports: result.docs, totalPages: result.totalPages, appName: packagejson.name, appVersion: packagejson.version, connectedUser: req.user, message: null })
        }
    })
}