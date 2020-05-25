const appRootPath = require('app-root-path');
var express = require('express');
var router = express.Router();
const passwordController = require(`${appRootPath}/controllers/password_controller`)
const passwordValidator = require(`${appRootPath}/validators/password_validator`)
const errorValidator = require(`${appRootPath}/validators/error_validator`)




//requesting to reset user password
router.post("/reset",
  passwordValidator.reset,
  errorValidator.check,
  passwordController.resetPassword,
  function (req, res, next) {
  });


//this route for the link sent to the email
router.get("/resetValidation", passwordController.resetValidation, function (req, res, next) {
})


module.exports = router;
