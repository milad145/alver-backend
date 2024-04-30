const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const _ = require("lodash");
//========================
const FeedbackSchema = require("./schema.js");
const feedbackModel = mongoose.model("feedback", FeedbackSchema);

//========================
class FeedbackQueries {

    /**
     * Create Feedback
     * @param params {Object}
     * @returns {*}
     */
    create(params) {
        const feedbackObject = new feedbackModel(params);
        return feedbackObject.save();
    }

    find(query, project, options) {
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(options.sort) ? true : options.sort = "_id";
        !_.isUndefined(options.order) ? true : options.order = 1;
        !_.isUndefined(options.limit) ? true : options.limit = 30;
        !_.isUndefined(options.skip) ? true : options.skip = 0;
        query.status = 1;
        return feedbackModel.find(query, project)
            .sort({[options.sort]: [options.order]}).limit(parseInt(options.limit)).skip(parseInt(options.skip));
    }

    aggregate(pipline) {
        !_.isUndefined(pipline) ? true : pipline = [];
        return feedbackModel.aggregate(pipline);
    }

    count(query) {
        !_.isUndefined(query) ? true : query = {};
        query.status = 1;
        return feedbackModel.count(query);
    }

    get(id, project, options) {
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(options) ? true : options = {};
        return feedbackModel.findOne({_id: id}, project);
    }

    getByQuery(query, project, options) {
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(options) ? true : options = {};
        return feedbackModel.findOne(query, project);
    }

    update(query, update, options) {
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(options) ? true : options = {};
        !_.isUndefined(options.new) ? true : options.new = true;
        !_.isUndefined(options.multi) ? true : options.multi = false;
        if (options.multi) {
            return feedbackModel.updateMany(query, update, options);
        } else {
            return feedbackModel.findOneAndUpdate(query, update, options);
        }
    }
}

module.exports = FeedbackQueries;


