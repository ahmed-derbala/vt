'use strict';
const appRootPath = require('app-root-path');
const modelName = require(`${appRootPath}/tools/shared`).modelName(__filename)

const fs = require('fs');
const path = require('path');
var model = {}

fs.readdirSync(__dirname)
  .forEach(file => {
    if (file != 'index.js') {
      model[require(`${appRootPath}/tools/shared`).modelName(file)] = require(`./${file}`)
    }
  });

module.exports = model;
