const config = require("config");
const queryOptions = config.get("queryOptions");

const _ = require("lodash");

const {timestampToJalali} = require("../../modules/assist");
const errorHandler = require("../../modules/errorHandler");
//========================
const PostQueries = require("./collectionQueries");
const postQueries = new PostQueries;

const CategoryQueries = require("../category/collectionQueries");
const categoryQueries = new CategoryQueries;
//========================
module.exports.homePosts = (city, lastId) => {
    let query = {status: 1, city};
    if (lastId) query._id = {$lt: lastId};
    return Promise.all([
        postQueries.find(query, {
            title: 1, cat: 1, city: 1, "fieldsValue.price": 1, createdAt: 1, mainImage: 1
        }, {sort: {_id: -1}, limit: queryOptions.post.limit, populate: true}),
        categoryQueries.find({main: true, status: 1}, {title: 1, parent: 1}, {limit: 0, sort: {sort: 1}})
    ])
        .then(payload => {
            return {posts: payload[0], categories: payload[1], postLimit: queryOptions.post.limit};
        })
        .catch(error => error);
};

module.exports.createPost = (author, title, description, cat, categories, city, cities, fieldsValue, images, mainImage, location, audios) => {
    let post = {
        author, categories, cat, city, cities, description, fieldsValue, images, title, audios, createdAt: new Date()
    };
    if (location) post.location = location;
    if (mainImage) post.mainImage = mainImage;
    return postQueries.create(post);
};

module.exports.editPost = (author, _id, title, description, cat, categories, city, cities, fieldsValue, images, mainImage, location, audios) => {
    let update = {
        categories, cat, city, cities, description, fieldsValue, images, title, audios, updatedAt: new Date()
    };
    let unset = {};
    if (location) update.location = location;
    else unset.location = "";
    if (mainImage) update.mainImage = mainImage;
    else unset.mainImage = "";
    return postQueries.update({author, _id}, {$set: update, $unset: unset, $inc: {updateCount: 1}});
};

module.exports.getPost = function (postId, project) {
    !_.isUndefined(project) ? true : project = {
        status: 1, categories: 1, images: 1, audios: 1, statusType: 1, cat: 1, city: 1, title: 1, createdAt: 1,
        description: 1, fieldsValue: 1, location: 1, mainImage: 1
    };
    let today = timestampToJalali(new Date().getTime());
    let hintValue = "hints." + today.jy + "_" + today.jm + "_" + today.jd;
    let query = {_id: postId, status: 1};
    return Promise.all([
        postQueries.getByQuery(query, project, {populate: true}),
        postQueries.update(query, {$inc: {[hintValue]: 1}}, {new: false, multi: false})
    ])
        .then(palyload => {
            if (palyload[0]) return palyload[0];
            else throw errorHandler.errorCode(1302);
        });
};

module.exports.getUserPost = function (postId, author) {
    return postQueries.getByQuery({_id: postId, author}, {}, {populate: true});
};

module.exports.getContactInfo = function (postId) {
    return postQueries.getPostAuthor(postId);
};

module.exports.countUserPostForToday = function (author) {
    return postQueries.count({
        author,
        statusType: 0,
        createdAt: {$gte: new Date(new Date().setHours(0, 0, 0, 0))}
    }, {}, {populate: true});
};

module.exports.deleteUserPost = function (postId, author) {
    return postQueries.deleteOneByQuery({_id: postId, author});
};

module.exports.filter = (city, lastId, cat, key) => {
    let query = {status: 1, cities: city};
    if (cat) query.categories = cat;
    if (lastId) query._id = {$lt: lastId};
    if (key) query["$or"] = [{"title": new RegExp(key, "i")}, {"description": new RegExp(key, "i")}];
    return postQueries.find(query, {
        title: 1, cat: 1, city: 1, "fieldsValue.price": 1, createdAt: 1, mainImage: 1
    }, {sort: {_id: -1}, limit: queryOptions.post.limit, populate: true})
        .then(payload => {
            return {posts: payload, postLimit: queryOptions.post.limit};
        });
};

module.exports.getUserPosts = (author, lastId) => {
    let query = {author};
    if (lastId) query._id = {$lt: lastId};
    return postQueries.find(query, {
        title: 1,
        cat: 1,
        city: 1,
        "fieldsValue.price": 1,
        createdAt: 1,
        mainImage: 1,
        status: 1,
        updatedAt: 1,
        updateCount: 1
    }, {sort: {_id: -1}, limit: queryOptions.post.limit, populate: true})
        .then(payload => {
            return {posts: payload, postLimit: queryOptions.post.limit};
        });
};
//========================
