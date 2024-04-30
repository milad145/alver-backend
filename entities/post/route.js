const express = require("express");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectID;
const _ = require("lodash");
//========================
const passport = require("passport");
require("../../middlewares/passport")(passport);

const fileService = require("../../services/fileService");
//========================
const errorHandler = require("../../modules/errorHandler");
const {toObj} = require("../../modules/assist");
//========================
const postService = require("./service");
const fieldService = require("../field/service");
//========================
//========================
module.exports = (() => {
    const router = express.Router();

    router.post("/", passport.authenticate("jwtAuth", {session: false}),
        (req, res, next) => {
            postService.countUserPostForToday(req.user._id)
                .then(count => {
                    if (count < 5) next();
                    else throw errorHandler.errorCode(1304);
                })
                .catch(error => {
                    if (error.responseCode) res.status(error.responseCode).send(error);
                    else res.status(500).send();
                });
        }, fileService.uploader(), (req, res) => {
            let {post} = req.body;
            try {
                post = JSON.parse(post);
                let images = req.images;
                let audios = req.audios;
                //(post.description && post.description.length >= 10)
                if (
                    (post.title && post.title.length >= 3) && (post.cat && ObjectId(post.cat))
                    && (post.categories && post.categories.length) && (post.cities && post.cities.length) && (post.city && ObjectId(post.city)) && (post.fieldsValue && typeof post.fieldsValue === "object")
                ) {
                    let mainImage;
                    if (images && images.length) {
                        _.find(post.images, {mainImage: true}) ? mainImage = _.find(post.images, {mainImage: true}).fileName : null;
                        if (mainImage)
                            mainImage = _.find(images, {filename: mainImage}).uri;
                        images = _.map(images, (img) => {
                            return {uri: img.uri, size: img.size};
                        });
                    }
                    postService.createPost(req.user._id, post.title, post.description, post.cat, post.categories, post.city, post.cities, post.fieldsValue, images, mainImage, post.location, audios)
                        .then(result => res.json({result}))
                        .catch(error => {
                            if (error.responseCode) res.status(error.responseCode).send(error);
                            else res.status(500).send();
                        });
                } else {
                    res.status(400).send();
                }
            } catch (e) {
                res.status(500).send();
            }
        });

    router.patch("/:id",
        passport.authenticate("jwtAuth", {session: false}),
        (req, res, next) => {
            postService.getUserPost(req.params.id, req.user._id)
                .then(post => {
                    if (post) {
                        req.post = toObj(post);
                        next();
                    }
                    else throw errorHandler.errorCode(1303);
                })
                .catch(error => {
                    if (error.responseCode) res.status(error.responseCode).send(error);
                    else res.status(500).send();
                });
        }, fileService.uploader(), (req, res) => {
            let {post} = req.body;
            let {id} = req.params;
            try {
                post = JSON.parse(post);
                let images = req.images || [];
                let audios = req.audios && req.audios.length ? req.audios : post.audios;
                //(post.description && post.description.length >= 10)
                if (
                    (post.title && post.title.length >= 3) && (post.cat && ObjectId(post.cat))
                    && (post.categories && post.categories.length) && (post.cities && post.cities.length) && (post.cities.includes(post.city)) && (post.city && ObjectId(post.city)) && (post.fieldsValue && typeof post.fieldsValue === "object")
                ) {
                    let mainImage;
                    _.find(post.images, {mainImage: true}) ? mainImage = _.find(post.images, {mainImage: true}) : null;
                    if (mainImage && mainImage.server) mainImage = mainImage.uri;
                    else if (mainImage) mainImage = _.find(images, {filename: mainImage.fileName}).uri;
                    images = _.map(images, _.partialRight(_.pick, "uri", "size"));
                    images = [..._.map(_.filter(post.images, {server: true}), _.partialRight(_.pick, "uri", "size")), ...images];
                    postService.editPost(req.user._id, id, post.title, post.description, post.cat, post.categories, post.city, post.cities, post.fieldsValue, images, mainImage, post.location, audios)
                        .then(() => {
                            res.send(mainImage);
                            let oldImages = req.post.images;
                            let newImages = _.map(images, "uri");
                            let oldAudios = req.post.audios;
                            let newAudios = _.map(audios, "uri");
                            if (oldImages && oldImages.length) {
                                oldImages = _.map(oldImages, "uri");
                                oldImages = _.differenceWith(oldImages, newImages, _.isEqual);
                                if (oldImages.length)
                                    DeleteFilesWorker.send({type: "images", files: oldImages});
                            }
                            if (oldAudios && oldAudios.length) {
                                oldAudios = _.map(oldAudios, "uri");
                                oldAudios = _.differenceWith(oldAudios, newAudios, _.isEqual);
                                if (oldAudios.length)
                                    DeleteFilesWorker.send({type: "audios", files: oldAudios});
                            }
                        })
                        .catch(error => {
                            if (error.responseCode) res.status(error.responseCode).send(error);
                            else res.status(500).send();
                        });
                } else {
                    res.status(400).send();
                }
            } catch (e) {
                res.status(500).send();
            }
        });

    router.get("/home", (req, res) => {
        let {city, lastId} = req.query;
        Promise.all([])
            .then(() => {
                try {
                    if (lastId) lastId = ObjectId(lastId);
                    if (city) city = ObjectId(city);
                    else errorHandler.errorCode(1301);
                } catch (e) {
                    throw errorHandler.errorCode(1301);
                }
                return postService.homePosts(city, lastId);
            })
            .then(result => res.json({result}))
            .catch(error => {
                if (error.responseCode) res.status(error.responseCode).send(error);
                else res.status(500).send();
            });
    });

    router.get("/filter", (req, res) => {
        let {cat, key, lastId, city} = req.query;
        Promise.all([])
            .then(() => {
                try {
                    if (cat) cat = ObjectId(cat);
                    if (lastId) lastId = ObjectId(lastId);
                    if (city) city = ObjectId(city);
                    else errorHandler.errorCode(1301);
                    if (key && key.length < 3) errorHandler.errorCode(1301);
                } catch (e) {
                    throw errorHandler.errorCode(1301);
                }
                return postService.filter(city, lastId, cat, key);
            })
            .then(result => {
                res.json({result});
            })
            .catch(error => {
                if (error.responseCode) res.status(error.responseCode).send(error);
                else res.status(500).send();
            });
    });

    router.get("/mine", passport.authenticate("jwtAuth", {session: false}), (req, res) => {
        let {lastId} = req.query;
        Promise.all([])
            .then(() => {
                let user = req.user._id;
                try {
                    user = ObjectId(user);
                    if (lastId) lastId = ObjectId(lastId);
                } catch (e) {
                    throw errorHandler.errorCode(1301);
                }
                return postService.getUserPosts(user, lastId);
            })
            .then(result => {
                res.json({result});
            })
            .catch(error => {
                if (error.responseCode) res.status(error.responseCode).send(error);
                else res.status(500).send();
            });
    });

    router.get("/:id", (req, res) => {
        let postId = req.params.id;
        Promise.resolve()
            .then(() => {
                try {
                    postId = ObjectId(postId);
                    return Promise.all([
                        fieldService.fieldsList(),
                        postService.getPost(postId)
                    ]);
                } catch (e) {
                    throw errorHandler.errorCode(1302);
                }
            })
            .then(result => {
                if (result[1]) res.json({result: {fields: result[0], post: result[1]}});
                else throw errorHandler.errorCode(1302);
            })
            .catch(error => {
                if (error.responseCode) res.status(error.responseCode).send(error);
                else res.status(500).send();
            });
    });

    router.get("/mine/:id", passport.authenticate("jwtAuth", {session: false}), (req, res) => {
        postService.getUserPost(req.params.id, req.user._id)
            .then(post => {
                if (post) res.json({post});
                else throw errorHandler.errorCode(1303);
            })
            .catch(error => {
                if (error.responseCode) res.status(error.responseCode).send(error);
                else res.status(500).send();
            });
    });

    router.post("/contact", passport.authenticate("jwtAuth", {session: false}), (req, res) => {
        let {post} = req.body;
        Promise.all([])
            .then(() => {
                try {
                    post = ObjectId(post);
                    return postService.getContactInfo(post);
                } catch (e) {
                    throw errorHandler.errorCode(1301);
                }
            })
            .then(post => {
                if (post) {
                    let contactInfo = toObj(post).author;
                    delete contactInfo._id;
                    res.json({
                        contactInfo, socialMedia: [
                            {
                                iconName: "whatsapp-square",
                                iconType: "FontAwesome5",
                                style: {color: "#44c052"},
                                message: "ارسال پیام در واتساپ",
                                linking: `whatsapp://send?phone=+98${contactInfo.phoneNumber}`
                            }
                        ]
                    });
                }
                else throw errorHandler.errorCode(1302);
            })
            .catch(error => {
                if (error.responseCode) res.status(error.responseCode).send(error);
                else res.status(500).send();
            });
    });

    router.delete("/mine/:id", passport.authenticate("jwtAuth", {session: false}), (req, res) => {
        let post = null;
        postService.getUserPost(req.params.id, req.user._id)
            .then(payload => {
                post = toObj(payload);
                if (post) {
                    return postService.deleteUserPost(req.params.id, req.user._id);
                }
                else throw errorHandler.errorCode(1303);
            })
            .then(() => {
                res.send(true);
                if (post.images && post.images.length)
                    DeleteFilesWorker.send({type: "images", files: _.map(post.images, "uri")});
                if (post.audios && post.audios.length)
                    DeleteFilesWorker.send({type: "audios", files: _.map(post.audios, "uri")});
            })
            .catch(error => {
                if (error.responseCode) res.status(error.responseCode).send(error);
                else res.status(500).send();
            });
    });

    return router;
})();
