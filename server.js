// ===============================================
// Express server file
// ===============================================
// inserting required libs
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const dotenv = require('dotenv');
// ===============================================
// support json encoded bodies

// ===============================================
// connect to mongoose database
let envConfig = dotenv.config();
envConfig = envConfig.parsed;
const initiateServer = require('./core/initiateServer');
mongoose.set('useCreateIndex', true);
mongoose.connect(envConfig.dbConfig, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, initiateServer.initiateServer());
// ===============================================
