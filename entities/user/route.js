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
const passport = require("passport");
require("../../middlewares/passport")(passport);
// ===============================================
const errorHandler = require("../../modules/errorHandler");
//========================
module.exports = (() => {
    const router = express.Router();

    router.post("/", (req, res) => {
        passport.authenticate("local-signup", (error, data) => {
            if (error && error.responseCode)
                res.status(error.responseCode).send(error);
            else if (error)
                res.status(500).send();
            else {
                let smsConfig = config.get("sms");
                let {smsText, smsCodeLength} = smsConfig;
                let {smsHash} = data;
                smsText = smsText.replace("{smsHash}", smsHash);
                res.json({smsText, smsCodeLength});
            }
        })(req, res);
    });

    router.post("/login", (req, res) => {
        passport.authenticate("local-login", (error, user) => {
            if (error) {
                if (error.responseCode)
                    res.status(error.responseCode).send(error);
                else
                    res.status(500).send();
            } else if (!user) {
                res.status(400).send(errorHandler.errorCode(400));
            } else {
                req.login(user, (err) => {
                    if (err) {
                        if (err.responseCode)
                            res.status(err.responseCode).send(err);
                        else {
                            res.status(500).send();
                        }
                    } else
                        return res.send({result: user});
                });
            }
        })(req, res);
    });

    router.post("/logout",
        passport.authenticate("jwtAuth", {session: false}), (req, res) => {
            req.logout();
            return res.send("done");
        });

    router.get("/", passport.authenticate("jwtAuth", {session: false}), (req, res) => {
        res.send(req.user);
    });

    return router;
})();
