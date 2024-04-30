// ===============================================
// passport js middleware
// ===============================================

const LocalStrategy = require("passport-local").Strategy;
const CustomStrategy = require("passport-custom").Strategy;
const jwt = require("jsonwebtoken");
const config = require("config");
const dotEnv = require("dotenv");

const UserQueries = require("../entities/user/collectionQueries");
const userQueries = new UserQueries;

const errorHandler = require("../modules/errorHandler");
const assist = require("../modules/assist");
const smsService = require("../services/smsService");

let envConfig = dotEnv.config();
envConfig = envConfig.parsed;

const jwtConf = config.get("jwt");
const EXPIRES_IN_SECONDS = jwtConf["EXPIRES_IN_SECONDS"];
const SECRET = envConfig.jwtSecret;
const ALGORITHM = envConfig.jwtAlgorithm;
const ISSUER = jwtConf["ISSUER"];
const AUDIENCE = jwtConf["AUDIENCE"];

const LOCAL_STRATEGY_CONFIG = {
    usernameField: "phoneNumber",
    passwordField: "activeCode",
    passReqToCallback: true
};

// ==============================================

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use("local-signup",
        new CustomStrategy((req, next) => {
            const {phoneNumber, smsHash, uniqueToken} = req.body;
            if (phoneNumber && assist.mobileNumberValidation(phoneNumber)) {
                let activeCode = Math.floor(100000 + Math.random() * 900000);
                return userQueries.getByQuery({phoneNumber}, {lastRequestCode: 1, activeCode: 1, activeTime: 1})
                    .then(user => {
                        if (!user) {
                            return userQueries.create({
                                phoneNumber,
                                activeCode,
                                activeTime: new Date(new Date().getTime() + (7 * 60 * 1000)),
                                lastRequestCode: new Date(),
                                uniqueTokens: [uniqueToken]
                            });
                        } else {
                            let lastRequestCode = user.lastRequestCode || new Date();
                            let activeTime = Math.floor((user.activeTime - new Date()) / (1000 * 60));
                            lastRequestCode = Math.floor((new Date() - lastRequestCode) / (1000 * 60));
                            let updateQuery = {lastRequestCode: new Date()};
                            if (lastRequestCode < 2 && activeTime > 2) updateQuery = false;
                            else if (lastRequestCode < 5 && activeTime > 2) {
                                activeCode = user.activeCode;
                            } else {
                                updateQuery = {
                                    ...updateQuery,
                                    activeCode,
                                    activeTime: new Date(new Date().getTime() + (7 * 60 * 1000))
                                };
                            }
                            if (updateQuery) return userQueries.update({phoneNumber}, {
                                $set: updateQuery,
                                $addToSet: {uniqueTokens: uniqueToken}
                            });
                            else return false;
                        }
                    })
                    .then(payload => {
                        if (payload) {
                            smsService.sendCode(phoneNumber, activeCode, smsHash);
                            return true;
                        }
                        else return true;
                    })
                    .then(() => next(null, {smsHash}, {}))
                    .catch(error => next(error, false, {}));
            } else next(errorHandler.errorCode(2007), false, {});
        })
    );

    passport.use("local-login",
        new LocalStrategy(LOCAL_STRATEGY_CONFIG, (req, phoneNumber, activeCode, next) => {
            userQueries.getByQuery({phoneNumber, activeCode, activeTime: {$gte: new Date()}}, {_id: true}, {})
                .then(user => {
                    if (user) {
                        let token = jwt.sign({user: user}, SECRET, {
                            algorithm: ALGORITHM, expiresIn: EXPIRES_IN_SECONDS, issuer: ISSUER, audience: AUDIENCE
                        });
                        next(null, {token, user}, {});
                    } else next(errorHandler.errorCode(2004), false, {});
                })
                .catch(error => next(error, false, {}));
        })
    );

    passport.use("jwtAuth",
        new CustomStrategy((req, next) => {
            let token = req.headers["authorization"];
            if (!token) {
                return next(null, false, errorHandler.errorCode(403));
            }
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) return next(null, false, errorHandler.errorCode(403));

                req.user = decoded.user;
                next(null, req.user);
            });
        })
    );

    passport.use("jwtAuth-ifExist",
        new CustomStrategy((req, next) => {
            let token = req.headers["authorization"];
            if (!token) {
                next(null, {});
            } else {
                jwt.verify(token, SECRET, (err, decoded) => {
                    if (err) return next(null, false, errorHandler.errorCode(403));

                    req.user = decoded.user;
                    next(null, req.user);
                });
            }
        })
    );
};
