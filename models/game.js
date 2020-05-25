const appRootPath = require('app-root-path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const modelName = require(`${appRootPath}/tools/shared`).modelName(__filename)
const mongoosePaginate = require('mongoose-paginate-v2');


let modelSchema = new Schema({
    User1Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        index: true
    },
    User2Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        index: true
    },
    user1Name: { type: String, required: true, index: true },
    user2Name: { type: String, required: true, index: true },

    user1Number: { type: Number, required: false,  index: true },
    user2Number: { type: Number, required: false,  index: true },
    user1Score: { type: Number, required: true, default: 0, index: true },
    user2Score: { type: Number, required: true, default: 0, index: true },
    turn: { type: String, required: true, default:1,index: true },
    link: { type: String, required: false, index: true, default: '' }, //url of that game like vt.com/game/id/123456789
    startedAt: { type: Date, required: false,default:null, index: true },
    terminatedAt: { type: Date, required: false,default:null, index: true },



}, { timestamps: true })
modelSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(modelName, modelSchema);
