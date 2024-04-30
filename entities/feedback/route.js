const express = require("express");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const dotEnv = require("dotenv");
const _ = require("lodash");
//========================
let envConfig = dotEnv.config();
envConfig = envConfig.parsed;
const config = require("config");
//========================
const feedbackService = require("./service");
// ===============================================
const errorHandler = require("../../modules/errorHandler");
//========================
module.exports = (() => {
    const router = express.Router();

    router.get("/:token", (req, res) => {
        feedbackService.getFeedback(req.params.token)
            .then(payload => {
                res.json(payload ? payload : "no");
            })
            .catch(error => {
                if (error.responseCode) res.status(error.responseCode).send(error);
                else res.status(500).send();
            });
    });

    router.post("/:token", (req, res) => {
        let {feedback} = req.body;
        feedbackService.setFeedback(req.params.token, feedback)
            .then(() => {
                res.send(feedback);
            })
            .catch(error => {
                if (error.responseCode) res.status(error.responseCode).send(error);
                else res.status(500).send();
            });
    });
    return router;
})();
