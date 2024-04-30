const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;
//===========================
//===========================
const citySchema = new Schema({
    parent: {type: Schema.ObjectId, ref: 'city'},
    label: {type: String, required: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    status: {type: Number, enum: [1, -1], default: 1},
}, {collection: 'city'});

module.exports = citySchema;
