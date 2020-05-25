const appRootPath = require('app-root-path');
var express = require('express');
var router = express.Router();
const prefs = require(`${appRootPath}/config/prefs`)
const dbTools = require(`${appRootPath}/tools/db_tools`)


router.get('/import', function (req, res, next) {
  //let dbURI = prefs.db.uri
  let dbURI = `mongodb+srv://user1:123@cluster0-djizf.mongodb.net/vt_prod_heroku?retryWrites=true&w=majority`
  dbTools.importCollection(dbURI, 'users')
  dbTools.importCollection(dbURI, 'games')
  dbTools.importCollection(dbURI, 'reports')
  return res.send('importing in background...')
})

module.exports = router;
