const appRootPath = require('app-root-path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
const uniqueMessages = require(`${appRootPath}/messages/unique_messages`)
const prefs = require(`${appRootPath}/config/prefs`);

let Invitation = new Schema({
    code: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },//email of the invited user
    targetRole: { type: String, required: true },
    InviterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

  
    active: { type: Boolean, required: false, default: true },
    passwordSet: { type: Boolean, required: false, default: false }




}, { timestamps: true })

Invitation.plugin(uniqueValidator, { message: `{PATH}={VALUE} ${uniqueMessages.alreadyTaken(prefs.defaultLang)}` })



module.exports = mongoose.model('Invitation', Invitation);
module.exports.kinds = ["SignupInvite", "AssessmentInvite"]
