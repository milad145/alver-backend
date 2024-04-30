const assist = require('../../modules/assist');
//========================
const FieldQueries = require('./collectionQueries');
const fieldQueries = new FieldQueries;
//========================
module.exports.insertField = (fields) => {
    let promises = [];
    for (const field of fields) {
        promises.push(fieldQueries.create(field))
    }
    return Promise.all(promises)
        .then(payload => payload)
        .catch(error => error)
};
module.exports.catFields = (cat) => {
    return fieldQueries.find({status: 1, $or: [{"owner.0": {$exists: false}}, {owner: cat}]},
        {name: 1, title: 1, type: 1, options: 1, unit: 1, placeholder: 1, sort: 1}, {limit: 0, sort: {sort: 1}})
};
module.exports.fieldsList = () => {
    return fieldQueries.find({status: 1}, {name: 1, sort: 1, type: 1, options: 1, unit: 1, title: 1}, {limit: 0})
};
//========================
