const UserQueries = require('./collectionQueries');
const userQueries = new UserQueries;
//========================
module.exports.homePosts = () => {
    return userQueries.find({status: 1}, {}, {})
        .then(payload => payload)
        .catch(error => error)
};
//========================
