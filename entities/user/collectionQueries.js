const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const _ = require('lodash');
//========================
const UserSchema = require('./schema.js');
const userModel = mongoose.model('user', UserSchema);

//========================
class UserQueries {

    /**
     * Create User
     * @param params {Object}
     * @returns {*}
     */
    create(params) {
        const userObject = new userModel(params);
        return userObject.save()
    }

    find(query, project, options) {
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(options.sort) ? true : options.sort = '_id';
        !_.isUndefined(options.order) ? true : options.order = 1;
        !_.isUndefined(options.limit) ? true : options.limit = 30;
        !_.isUndefined(options.skip) ? true : options.skip = 0;
        query.status = 1;
        if (options.populate)
            return userModel.find(query, project)
                .sort({[options.sort]: [options.order]}).limit(parseInt(options.limit)).skip(parseInt(options.skip))
                .populate({path: 'blockList', select: 'avatar username fname lname'});
        else
            return userModel.find(query, project)
                .sort({[options.sort]: [options.order]}).limit(parseInt(options.limit)).skip(parseInt(options.skip))
    }

    aggregate(pipline) {
        !_.isUndefined(pipline) ? true : pipline = [];
        return userModel.aggregate(pipline)
    }

    count(query) {
        !_.isUndefined(query) ? true : query = {};
        query.status = 1;
        return userModel.count(query)
    }

    get(id, project, options) {
        !_.isUndefined(project) ? true : project = {fullName: 1, fname: 1, lname: 1, avatar: 1, username: 1};
        !_.isUndefined(options) ? true : options = {};
        if (options.populate)
            return userModel.findOne({_id: id}, project)
                .populate({path: 'blockList', select: 'avatar username lname fname'});
        else
            return userModel.findOne({_id: id}, project)
    }

    getByQuery(query, project, options) {
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(options) ? true : options = {};
        return userModel.findOne(query, project)
    }

    update(query, update, options) {
        !_.isUndefined(query) ? true : query = {}
        !_.isUndefined(options) ? true : options = {}
        !_.isUndefined(options.new) ? true : options.new = true
        !_.isUndefined(options.multi) ? true : options.multi = false
        if (options.multi) {
            return userModel.updateMany(query, update, options)
        } else {
            return userModel.findOneAndUpdate(query, update, options)
        }
    }
}

module.exports = UserQueries;


