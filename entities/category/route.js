const fs = require('fs');
const path = require('path');
const express = require('express');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectID;
const _ = require('lodash');
const config = require('config');
//========================
const passport = require('passport');
require('../../middlewares/passport')(passport);

const fileService = require('../../services/fileService');
//========================
const errorHandler = require('../../modules/errorHandler');
const common = require('../../middlewares/common');
//========================
const categoryService = require('./service');
//========================
module.exports = (() => {
    const router = express.Router();

    router.get('/', (req, res) => {
        categoryService.categoryList()
            .then(result => res.json({result}))
            .catch(error => {
                if (error.responseCode) res.status(error.responseCode).send(error);
                else res.status(500).send();
            })
    });

    router.post('/', passport.authenticate('jwtAuth', {session: false}), (req, res) => {
        let {categories} = req.body;
        if (typeof categories === "object" && categories.length) {
            categoryService.insertCategory(categories)
                .then(result => res.send(result))
                .catch(error => {
                    if (error.responseCode) res.status(error.responseCode).send(error);
                    else res.status(500).send();
                })
        } else {
            let error = errorHandler.errorCode(1101);
            res.status(error.responseCode).send(error);
        }
    });

    router.post('/home',(req, res) => {
        let {categories} = req.body;
        if (typeof categories === "object" && categories.length) {
            categoryService.insertCategory(categories)
                .then(result => res.send(result))
                .catch(error => {
                    if (error.responseCode) res.status(error.responseCode).send(error);
                    else res.status(500).send();
                })
        } else {
            let error = errorHandler.errorCode(1101);
            res.status(error.responseCode).send(error);
        }
    });

    return router
})();
