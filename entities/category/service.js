const assist = require('../../modules/assist');
//========================
const CategoryQueries = require('./collectionQueries');
const categoryQueries = new CategoryQueries;
//========================
module.exports.insertCategory = (categories) => {
    let promises = [];
    for (const category of categories) {
        promises.push(categoryQueries.create(category))
    }
    return Promise.all(promises)
        .then(payload => payload)
        .catch(error => error)
};
module.exports.categoryList = () => {
    return categoryQueries.find({status: 1}, {title: 1, parent: 1}, {limit: 0, sort: {sort: 1}})
};
//========================
