const mongoose = require('mongoose');
const _ = require('lodash');
//========================
const citySchema = require('./schema.js');
const cityModel = mongoose.model('city', citySchema);

//========================
class CityQueries {

    /*
     * create display docs
     * params:
     * Object params
     */
    create(params) {
        const cityObject = new cityModel(params);
        return cityObject.save()
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
        if (options.populate)
            return cityModel.find(query, project)
                .sort(options.sort).limit(parseInt(options.limit)).skip(parseInt(options.skip))
                .populate({path: 'author', select: 'avatar username'});
        else
            return cityModel.find(query, project)
                .sort(options.sort).limit(parseInt(options.limit)).skip(parseInt(options.skip))
    }

    aggregate(pipline, options) {
        !_.isUndefined(pipline) ? true : pipline = [];
        !_.isUndefined(options) ? true : options = {};
        return cityModel.aggregate(pipline)
    }

    count(query) {
        !_.isUndefined(query.status) ? true : query.status = 1;
        return cityModel.count(query)
    }

    get(id, project, options) {
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(options) ? true : options = {};
        if (options.populate)
            return cityModel.findOne({_id: id}, project)
                .populate({path: 'author', select: 'avatar username'})
        else
            return cityModel.findOne({_id: id}, project)
    }

    getByQuery(query, project, options) {
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(options) ? true : options = {};
        !_.isUndefined(query.status) ? true : query.status = 1;
        if (options.populate)
            return cityModel.findOne(query, project)
                .populate({path: 'author', select: 'avatar username'});
        else
            return cityModel.findOne(query, project)
    }

    update(query, update, updateOptions, options) {
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(options) ? true : options = {};
        !_.isUndefined(updateOptions) ? true : updateOptions = {};
        !_.isUndefined(updateOptions.new) ? true : updateOptions.new = true;
        !_.isUndefined(updateOptions.multi) ? true : updateOptions.multi = false;
        !_.isUndefined(query.status) ? true : query.status = 1;
        if (updateOptions.multi) {
            if (options.populate)
                return cityModel.updateMany(query, update, updateOptions)
                    .populate({path: 'author', select: 'avatar username'});
            else
                return cityModel.updateMany(query, update, updateOptions)
        } else {
            if (options.populate)
                return cityModel.findOneAndUpdate(query, update, updateOptions)
                    .populate({path: 'author', select: 'avatar username'});
            else
                return cityModel.findOneAndUpdate(query, update, updateOptions)
        }
    }

    deleteOne(id) {
        return cityModel.deleteOne({_id: id})
    }

    deleteOneByQuery(query) {
        return cityModel.deleteOne(query)
    }
}

module.exports = CityQueries;


