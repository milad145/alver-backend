const express = require("express");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectID;
//========================
const errorHandler = require("../modules/errorHandler");
//========================
const postService = require("../entities/post/service");
module.exports = (() => {
    const router = express.Router();

    router.get("/", (req, res) => res.send("Hello World"));

    router.get("/p/:id/:title", (req, res) => {
        let postId = req.params.id;
        Promise.resolve()
            .then(() => {
                try {
                    postId = ObjectId(postId);
                    return postService.getPost(postId);
                } catch (e) {
                    throw errorHandler.errorCode(1302);
                }
            })
            .then(result => {
                if (result) res.render("post", {post: result});
                else throw errorHandler.errorCode(1302);
            })
            .catch(error => {
                if (error.responseCode) res.render("error/" + error.responseCode);
                else res.status(500).render("error/500");
            });
    });
    router.get("/app/aboutUs", (req, res) => {
        res.render("appView/aboutUs", {phoneNumber: "", chatHome: ""});
    });
    router.get("/icons", (req, res) => {
        res.render("icons");
    });
    router.get("/*", (req, res) => {
        res.render("error/404");
    });

    return router;
})();
