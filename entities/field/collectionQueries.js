const mongoose = require('mongoose');
const _ = require('lodash');
//========================
const fieldSchema = require('./schema.js');
const fieldModel = mongoose.model('field', fieldSchema);

//========================
class FieldQueries {

    /*
     * create display docs
     * params:
     * Object params
     */
    create(params) {
        const fieldObject = new fieldModel(params);
        return fieldObject.save()
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
        return fieldModel.find(query, project)
            .sort(options.sort).limit(parseInt(options.limit)).skip(parseInt(options.skip))
    }

    aggregate(pipline, options) {
        !_.isUndefined(pipline) ? true : pipline = [];
        !_.isUndefined(options) ? true : options = {};
        return fieldModel.aggregate(pipline)
    }

    count(query) {
        !_.isUndefined(query.status) ? true : query.status = 1;
        return fieldModel.count(query)
    }

    get(id, project, options) {
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(options) ? true : options = {};
        return fieldModel.findOne({_id: id}, project, options)
    }

    getByQuery(query, project, options) {
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(options) ? true : options = {};
        !_.isUndefined(query.status) ? true : query.status = 1;
        return fieldModel.findOne(query, project, options)
    }

    update(query, update, updateOptions, options) {
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(options) ? true : options = {};
        !_.isUndefined(updateOptions) ? true : updateOptions = {};
        !_.isUndefined(updateOptions.new) ? true : updateOptions.new = true;
        !_.isUndefined(updateOptions.multi) ? true : updateOptions.multi = false;
        !_.isUndefined(query.status) ? true : query.status = 1;
        if (updateOptions.multi) {
            return fieldModel.updateMany(query, update, updateOptions)
        } else {
            return fieldModel.findOneAndUpdate(query, update, updateOptions)
        }
    }

    deleteOne(id) {
        return fieldModel.deleteOne({_id: id})
    }

    deleteOneByQuery(query) {
        return fieldModel.deleteOne(query)
    }
}

module.exports = FieldQueries;


