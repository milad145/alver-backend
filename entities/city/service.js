const assist = require('../../modules/assist');
//========================
const CityQueries = require('./collectionQueries');
const cityQueries = new CityQueries;
//========================
module.exports.insertCity = (cities) => {
    let promises = [];
    for (const city of cities) {
        promises.push(cityQueries.create(city))
    }
    return Promise.all(promises)
        .then(payload => payload)
        .catch(error => error)
};
module.exports.cityList = () => {
    return cityQueries.find({status: 1}, {label: 1, parent: 1, latitude: 1, longitude: true}, {
        limit: 0,
        sort: {label: 1}
    })
};
//========================
