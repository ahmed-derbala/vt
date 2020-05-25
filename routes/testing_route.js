const appRootPath = require('app-root-path');
var express = require('express');
var router = express.Router();

const userController = require(`${appRootPath}/controllers/user_controller`)
const { check, validationResult } = require('express-validator');
const prefs = require(`${appRootPath}/config/prefs`);
const userValidator = require(`${appRootPath}/validators/user_validator`)
const errorValidator = require(`${appRootPath}/validators/error_validator`)


//creating new user without an invitation, mainly super users
router.get('/test',
  function (req, res, next) {
    console.log('====================================');
    console.log(req.connection.remoteAddress);
    console.log('====================================');
    console.log(req.ip);
    console.log(req.ips);
    res.send(req.ipInfo);

  })


module.exports = router;
