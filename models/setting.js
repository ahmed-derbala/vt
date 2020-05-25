    const appRootPath = require('app-root-path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const prefs = require(`${appRootPath}/config/prefs`);


let Setting = new Schema({
    SupportEmails: { type: String, required: true, index: true },
    


}, { timestamps: true })

module.exports.kind = ["assessment", "technical", "sales"]
module.exports.seniority = ["internship", "junior", "midlevel", "senior","expert"]
module.exports = mongoose.model('Setting', Setting);
