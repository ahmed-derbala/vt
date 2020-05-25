const appRootPath = require('app-root-path');
var express = require('express');
var router = express.Router();
const path = require('path');
const packagejson = require('../package.json');
const server = require('../server')
const prefs = require(`${appRootPath}/config/prefs`)
const ip = require("ip");
var winston = require('winston');//logging
const rimraf = require('rimraf');
const fs = require('fs');
const colors = require('colors/safe');
const dbTools = require(`${appRootPath}/tools/db_tools`)
const ioTools = require(`${appRootPath}/tools/socketio_tools`)

router.get('/', function (req, res, next) {  
  return res.render('index',{user:req.user,rooms:ioTools.rooms()})
})

router.get('/signin', function (req, res, next) {
  res.render('signin', {  condition: true, anyArray: [1, 2, 3] });
})


router.get('/readme', function (req, res) {
  //res.sendFile(path.join(global.appRootPath + '/doc.html'));
  if (process.env.NODE_ENV != 'production') {
    res.sendFile(path.join(appRootPath + '/docs/readme.html'));
  } else {
    //return res.status(200).send('available only on development mode')
    res.redirect(`http://${ip.address()}:${prefs.frontendPort}`)
  }
});

router.get('/man', function (req, res) {
  //res.sendFile(path.join(global.appRootPath + '/doc.html'));
  if (process.env.NODE_ENV != 'production') {
    res.sendFile(path.join(appRootPath + '/docs/man.txt'));
  } else {
    //return res.status(200).send('available only on development mode')
    res.redirect(`http://${ip.address()}:${prefs.frontendPort}`)
  }
});


router.get('/log', function (req, res) {
  /*if (process.env.NODE_ENV == 'production') {
    return res.status(200).send(`Not available on production mode | ${packagejson.name} ${packagejson.version}`)
  }*/
  let filename = packagejson.name
  let errormessage = ''

  if (fs.existsSync(`${appRootPath}/logs/${req.query.id}.log`)) {
    filename = req.query.id
  } else if (req.query.id != null) {
    errormessage = `${req.query.id}.log was not found, you can reset logs via ${ip.address()}:${prefs.backPort}/resetLogs`
  }

  let options2 = {
    file: {
      level: 'verbose',
      filename: `${appRootPath}/logs/${filename}.log`,
      timestamp: true,
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      json: true,
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.json(),
      )
    }
  }

  let logQuery = winston.createLogger({
    transports:
      new winston.transports.File(options2.file),
    exitOnError: false, // do not exit on handled exceptions
  });

  if (!req.query.limit) {
    req.query.limit = 1000
  }
  if (!req.query.order) {
    req.query.order = 'desc'
  }
  let queryOptions = {
    from: req.query.from,
    until: req.query.until,
    limit: req.query.limit,
    start: 0,
    order: req.query.order,
    //fields: ['message']
  }
  return logQuery.query(queryOptions, function (err, results) {
    if (err) {
      return err
    }
    let finalResulat = '';
    let logsCounter = 0
    for (let i = 0; i < results.file.length; i++) {
      if (req.query.level) {
        if (req.query.level == results.file[i].level) {
          logsCounter++
          finalResulat = finalResulat + '\n\n\n' + JSON.stringify(results.file[i])
        }
      } else {
        logsCounter++
        finalResulat = finalResulat + '\n\n\n' + JSON.stringify(results.file[i])
      }
    }

    let minutes = 0, hours = 0, days = 0
    let serverRun = Math.floor((((Math.abs(new Date() - new Date(server.appStartedAt))) / 1000) / 60))

    if (serverRun >= 1440) {
      days = Math.floor((serverRun / 60) / 24)
      serverRun = serverRun - days * 24 * 60
    }
    if (serverRun > 60 && serverRun < 1440) {
      hours = Math.floor(serverRun / 60)
      serverRun = serverRun - hours * 60
    }

    minutes = serverRun

    if (finalResulat.length == 0) {
      errormessage = `you can reset logs via ${ip.address()}:${prefs.backPort}/resetLogs`
    }
    return res.end(
      `${packagejson.name} ${packagejson.version}
      manual: http://${server.ip}:${prefs.backPort}/man
      API_DOC: http://${server.ip}:${prefs.backPort}/api/doc

      applied filters: ${JSON.stringify(req.query)}
      loaded ${logsCounter} Logs from ${filename}.log
      ${errormessage}
    filter options
    level:error, verbose, warn, info, default=none
    order:asc, desc, default=desc
    limit:default=1000
    id:default=${packagejson.name}, you can set a user id like ?id=1

    NODE_ENV=${process.env.NODE_ENV}
    appRootPath: ${appRootPath}

    server startedAt    : ${server.appStartedAt}
    current server time : ${new Date()}
    runtime duration    : ${days} days ${hours} hours ${minutes} minutes ${finalResulat}`)
  });
})

router.get('/resetLogs', function (req, res) {
  if (process.env.NODE_ENV == 'production') {
    return res.status(200).send('available only on development mode')
  }
  rimraf(`${appRootPath}/logs/*`, function () { res.send('done'); });
})





module.exports = router;
