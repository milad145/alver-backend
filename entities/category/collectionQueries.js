const mongoose = require('mongoose');
const _ = require('lodash');
//========================
const categorySchema = require('./schema.js');
const categoryModel = mongoose.model('category', categorySchema);

//========================
class CategoryQueries {

    /*
     * create display docs
     * params:
     * Object params
     */
    create(params) {
        const categoryObject = new categoryModel(params);
        return categoryObject.save()
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
        !_.isUndefined(options.sort) ? true : options.sort = {'_id': -1};
        !_.isUndefined(options.limit) ? true : options.limit = 30;
        !_.isUndefined(options.skip) ? true : options.skip = 0;
        !_.isUndefined(query.status) ? true : query.status = 1;
        return categoryModel.find(query, project)
            .sort(options.sort).limit(parseInt(options.limit)).skip(parseInt(options.skip))
    }

    aggregate(pipline, options) {
        !_.isUndefined(pipline) ? true : pipline = [];
        !_.isUndefined(options) ? true : options = {};
        return categoryModel.aggregate(pipline)
    }

    count(query) {
        !_.isUndefined(query.status) ? true : query.status = 1;
        return categoryModel.count(query)
    }

    get(id, project, options) {
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(options) ? true : options = {};
        return categoryModel.findOne({_id: id}, project)
    }

    getByQuery(query, project, options) {
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(options) ? true : options = {};
        !_.isUndefined(query.status) ? true : query.status = 1;
        return categoryModel.findOne(query, project)
    }

    update(query, update, updateOptions, options) {
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(options) ? true : options = {};
        !_.isUndefined(updateOptions) ? true : updateOptions = {};
        !_.isUndefined(updateOptions.new) ? true : updateOptions.new = true;
        !_.isUndefined(updateOptions.multi) ? true : updateOptions.multi = false;
        !_.isUndefined(query.status) ? true : query.status = 1;
        if (updateOptions.multi) {
            return categoryModel.updateMany(query, update, updateOptions)
        } else {
            return categoryModel.findOneAndUpdate(query, update, updateOptions)
        }
    }

    deleteOne(id) {
        return categoryModel.deleteOne({_id: id})
    }

    deleteOneByQuery(query) {
        return categoryModel.deleteOne(query)
    }
}

module.exports = CategoryQueries;


