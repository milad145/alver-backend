const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;
//===========================
//===========================
const postSchema = new Schema({
    author: {type: Schema.ObjectId, ref: 'user'},
    status: {type: Number, enum: [1, -1], default: 1},
    categories: [{type: Schema.ObjectId, ref: 'category'}],
    cat: {type: Schema.ObjectId, ref: 'category'},
    city: {type: Schema.ObjectId, ref: 'city'},
    cities: [{type: Schema.ObjectId, ref: 'city'}],
    description: {type: String},
    fieldsValue: Object,
    hints: Object,
    images: Array,
    audios: Array,
    mainImage: String,
    title: {type: String, required: true},
    location: {
        latitude: Number,
        longitude: Number
    },
    createdAt: Date,
    updatedAt: Date,
    statusType: {type: Number, enum: [0, 1], default: 0},
    updateCount: {type: Number, default: 0}
}, {collection: 'post'});

module.exports = postSchema;
