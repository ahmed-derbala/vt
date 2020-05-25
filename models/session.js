const appRootPath = require('app-root-path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Session = new Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: { type: String, required: true, max: 100, index: true },
    attempt: { type: Number, required: false, min: 0 },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    token: { type: String, required: false,default:null },

}, { timestamps: true });

module.exports = mongoose.model('Session', Session);