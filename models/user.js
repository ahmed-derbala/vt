const appRootPath = require('app-root-path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
const uniqueMessages = require(`${appRootPath}/messages/unique_messages`)
const prefs = require(`${appRootPath}/config/prefs`);
var validate = require('mongoose-validator')

var emailValidator = 
    validate({
      validator: 'isEmail',
      message: 'invaid email format',
    })
  
let User = new Schema({
    email: { type: String, required: false, unique: true, index: true,validate:emailValidator },
    phone: { type: String, required: false, max: 100, unique: false, index: false },
    userName: { type: String, required: true ,unique: true},
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    clearance: { type: Object, required: true },
    gender: { type: String, required: false, default: 'SECRET' },
    lang: { type: String, required: false },
    InvitationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invitation'
    },
    CompanyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },

    settings: { type: Object, required: false },
    password: { type: String, required: true, select: false, },
    isActive: { type: Boolean, required: true, default: true, },
    showContactInfos: { type: Boolean, required: false, default: true },



}, { timestamps: true });

User.plugin(uniqueValidator, { message: `{PATH}={VALUE} ${uniqueMessages.alreadyTaken(prefs.defaultLang)}` });


module.exports.genders = ['MALE','FEMALE','SECRET']
module.exports = mongoose.model('User', User);
