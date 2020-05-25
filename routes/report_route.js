const appRootPath = require('app-root-path');
var express = require('express');
var router = express.Router();
const modelNameRouteLow = require(`${appRootPath}/tools/shared`).modelName(__filename,'route','low')
const controller = require(`${appRootPath}/controllers/report_controller`)
const validator = require(`${appRootPath}/validators/report_validator`)
const errorValidator = require(`${appRootPath}/validators/error_validator`)
const packagejson = require('../package.json');
const authorize = require(`${appRootPath}/utils/auth`).authorize


//router.get('/all', (req, res) => res.render('game/game_all'));
router.get('/all',
  authorize(['SUPER','ADMIN']),
 controller.all,
 
)


router.get('/create/:id', (req, res) => {  
  return res.render('report/report_create', { appName: packagejson.name, appVersion: packagejson.version, connectedUser: req.user,data:{id:req.query.id} })
})

router.post('/create',
  controller.create,
)

router.post('/search',
  //validator.create,
  //errorValidator.check,
  controller.search,
)

router.get('/search',
  //validator.create,
  //errorValidator.check,
  controller.search,
)

router.post('/delete',
  //validator.create,
  // errorValidator.check,
  controller.delete,
)

router.get('/page/', controller.page,
)
module.exports = router;
