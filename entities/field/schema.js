const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;
//===========================
//===========================
const fieldSchema = new Schema({
    title: String,
    name: String,
    status: {type: Number, enum: [1, -1], default: 1},
    type: {type: String, enum: ["select", "number", "boolean"]},
    placeholder: {type: String, enum: ["انتخاب", "تعیین"]},
    owner: [{type: Schema.ObjectId, ref: 'category'}],
    options: [{title: String, value: String}],
    sort: {type: Number, default: 2},
    unit: [{title: String, name: String, default: {type: Boolean, default: false}}],
    filter: {type: Boolean, default: false},
}, {collection: 'field'});

module.exports = fieldSchema;
