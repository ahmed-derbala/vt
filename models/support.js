const appRootPath = require('app-root-path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const prefs = require(`${appRootPath}/config/prefs`);


let Support = new Schema({
    kind: { type: String, required: true, index: true },
    description: { type: String, required: false },
    JobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    //id of assessment to be used by the recruiter in response to his assessment support request
    AssessmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment',
        required: false
    },
    User: { type: Object, required: true, index: true },
    seniority: { type: String, required: true },
    processed: { type: Boolean, required: true,default:false },
    response: { type: String, required: false },



}, { timestamps: true })

module.exports.kind = ["assessment", "technical", "sales"]
module.exports.seniority = ["internship", "junior", "midlevel", "senior","expert"]
module.exports = mongoose.model('Support', Support);
