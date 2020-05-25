const appRootPath = require('app-root-path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Notification = new Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: { type: String, required: false, max: 100, index: true },
    description: { type: String, required: false },
    

}, { timestamps: true });

module.exports = mongoose.model('Notification', Notification);