const appRootPath = require('app-root-path');
var express = require('express');
var router = express.Router();
const userController = require(`${appRootPath}/controllers/user_controller`)
const userValidator = require(`${appRootPath}/validators/user_validator`)
const errorValidator = require(`${appRootPath}/validators/error_validator`)
const packagejson = require('../package.json');


router.get('/signup', (req, res) => res.render('user/user_signup',{code:null,email:null,connectedUser:null}));
router.post('/signup',
  userValidator.signup,
  errorValidator.check,
  userController.signup,
)

router.get('/signin', (req, res) => {
  return res.render('user/user_signin',{ appName: packagejson.name, appVersion: packagejson.version, connectedUser: req.user,message:null })
})
router.post('/signin',
  //userValidator.signin,
  errorValidator.check,
  userController.signin,
)

router.post('/signout',
  //userValidator.signin,
  errorValidator.check,
  userController.signout,
)

//update user profile
router.put("/update",
  userValidator.update,
  errorValidator.check,
  userController.update
);


module.exports = router;
