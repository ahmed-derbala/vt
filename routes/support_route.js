const appRootPath = require('app-root-path');
var express = require('express');
var router = express.Router();
const authorize = require(`${appRootPath}/utils/auth`).authorize
const roles = require(`${appRootPath}/utils/clearance`).roles
const clearance = require(`${appRootPath}/utils/clearance`)
const asyncForEach = require(`${appRootPath}/tools/shared`).asyncForEach
const supportController = require(`${appRootPath}/controllers/support_controller`)




router.post('/request',/*authorize(clearance.RECRUITER.title),*/ supportController.request, function (req, res, next) {
})

router.put('/respond/:id',/*authorize(clearance.RECRUITER.title),*/ supportController.respond, function (req, res, next) {
})

module.exports = router;
