const mongoose = require("mongoose");
const _ = require("lodash");
//========================
const postSchema = require("./schema.js");
const postModel = mongoose.model("post", postSchema);

//========================
class PostQueries {

    /*
     * create display docs
     * params:
     * Object params
     */
    create(params) {
        const postObject = new postModel(params);
        return postObject.save();
    }

    /**
     * @param query {Object}
     * @param project {Object}
     * @param options {Object}
     * @returns {*}
     */
    find(query, project, options) {
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(options.sort) ? true : options.sort = {"_id": -1};
        !_.isUndefined(options.limit) ? true : options.limit = 30;
        !_.isUndefined(options.skip) ? true : options.skip = 0;
        if (options.populate)
            return postModel.find(query, project)
                .sort(options.sort).limit(parseInt(options.limit)).skip(parseInt(options.skip))
                .populate({
                    path: "city",
                    select: "label parent latitude longitude",
                    populate: {path: "parent", select: "label"}
                })
                .populate({path: "cat", select: "title"});
        else
            return postModel.find(query, project)
                .sort(options.sort).limit(parseInt(options.limit)).skip(parseInt(options.skip));
    }

    aggregate(pipline, options) {
        !_.isUndefined(pipline) ? true : pipline = [];
        return postModel.aggregate(pipline);
    }

    count(query) {
        return postModel.countDocuments(query);
    }

    get(id, project, options) {
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(options) ? true : options = {};
        if (options.populate)
            return postModel.findOne({_id: id}, project)
                .populate({
                    path: "city",
                    select: "label parent latitude longitude",
                    populate: {path: "parent", select: "label"}
                })
                .populate({path: "cat", select: "title"});
        else
            return postModel.findOne({_id: id}, project);
    }

    getByQuery(query, project, options) {
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(options) ? true : options = {};
        if (options.populate)
            return postModel.findOne(query, project)
                .populate({
                    path: "city",
                    select: "label parent latitude longitude",
                    populate: {path: "parent", select: "label"}
                })
                .populate({path: "cat", select: "title"});
        else
            return postModel.findOne(query, project);
    }

    getPostAuthor(_id) {
        return postModel.findOne({_id}, {author: 1})
            .populate({path: "author", select: "phoneNumber"});
    }

    update(query, update, updateOptions, options) {
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(options) ? true : options = {};
        !_.isUndefined(updateOptions) ? true : updateOptions = {};
        !_.isUndefined(updateOptions.new) ? true : updateOptions.new = true;
        !_.isUndefined(updateOptions.multi) ? true : updateOptions.multi = false;
        if (updateOptions.multi) {
            if (options.populate)
                return postModel.updateMany(query, update, updateOptions)
                    .populate({
                        path: "city",
                        select: "label parent latitude longitude",
                        populate: {path: "parent", select: "label"}
                    })
                    .populate({path: "cat", select: "title"});
            else
                return postModel.updateMany(query, update, updateOptions);
        } else {
            if (options.populate)
                return postModel.findOneAndUpdate(query, update, updateOptions)
                    .populate({
                        path: "city",
                        select: "label parent latitude longitude",
                        populate: {path: "parent", select: "label"}
                    })
                    .populate({path: "cat", select: "title"});
            else
                return postModel.findOneAndUpdate(query, update, updateOptions);
        }
    }

    deleteOne(id) {
        return postModel.deleteOne({_id: id});
    }

    deleteOneByQuery(query) {
        return postModel.deleteOne(query);
    }
}

module.exports = PostQueries;


