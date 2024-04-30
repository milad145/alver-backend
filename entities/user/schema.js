const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;
//===========================
const userSchema = new Schema({
    activeCode: String,
    activeTime: Date,
    phoneNumber: {
        type: String,
        unique: true,
        required: true
    },
    createdAt: Date,
    lastRequestCode: Date,
    uniqueTokens: Array
}, {collection: "user"});
// ======================
// generating a hash
userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = (password, pass) => {
    return bcrypt.compareSync(password, pass);
};

module.exports = userSchema;
