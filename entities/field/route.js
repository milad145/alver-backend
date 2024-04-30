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
const fieldService = require('./service');
//========================
module.exports = (() => {
    const router = express.Router();

    router.get('/:cat', (req, res) => {
        try {
            let cat = ObjectId(req.params.cat);

            fieldService.catFields(cat)
                .then(result => res.json({result}))
                .catch(error => {
                    if (error.responseCode) res.status(error.responseCode).send(error);
                    else res.status(500).send();
                })
        } catch (e) {
            let error = errorHandler.errorCode(1201);
            res.status(error.responseCode).send(error);
        }
    });

    router.post('/', passport.authenticate('jwtAuth', {session: false}), (req, res) => {
        let {fields} = req.body;
        if (typeof fields === "object" && fields.length) {
            fieldService.insertField(fields)
                .then(result => res.send(result))
                .catch(error => {
                    if (error.responseCode) res.status(error.responseCode).send(error);
                    else res.status(500).send();
                })
        } else {
            let error = errorHandler.errorCode(1201);
            res.status(error.responseCode).send(error);
        }
    });

    return router
})();
