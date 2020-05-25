/**
 * This file handles db connection
 */
const appRootPath = require('app-root-path');
const log = require(`${appRootPath}/utils/log`).log
const prefs = require(`${appRootPath}/config/prefs`)
var mongoose = require('mongoose');

mongoose.connect(prefs.db.uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
db.on('error', function () {
});

db.once('open', function () {
  log().debug({ message: `[DB_CONN_SUCCESS] ${prefs.db.name} | ${prefs.db.url}` })
});


