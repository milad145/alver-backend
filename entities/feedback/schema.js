const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const Schema = mongoose.Schema;
//===========================
const feedbackSchema = new Schema({
    token: {
        type: String,
        unique: true,
        required: true
    },
    value: Boolean,
    createdAt: Date,
    updatedAt: Date
}, {collection: "feedback"});
// ======================

module.exports = feedbackSchema;
