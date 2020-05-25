const appRootPath = require('app-root-path');
var express = require('express');
var router = express.Router();

const roles = require(`${appRootPath}/utils/clearance`).roles

router.get('/all', function (req, res, next) {
res.status(200).send(roles)
})


module.exports = router;
