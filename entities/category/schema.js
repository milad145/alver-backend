const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const Schema = mongoose.Schema;
//===========================
//===========================
const categorySchema = new Schema({
    parent: {type: Schema.ObjectId, ref: "category"},
    title: String,
    status: {type: Number, enum: [1, -1], default: 1},
    sort: Number,
    main: {type: Boolean, default: false}
}, {collection: "category"});

module.exports = categorySchema;
