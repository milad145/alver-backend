const FeedbackQueries = require("./collectionQueries");
const feedbackQueries = new FeedbackQueries;
//========================
module.exports.getFeedback = (token) => {
    return feedbackQueries.getByQuery({token}, {}, {})
        .then(payload => payload)
        .catch(error => error);
};

module.exports.setFeedback = (token, feedback) => {
    let userFeedback = {token, value: feedback, createdAt: new Date(), updatedAt: new Date()};
    return feedbackQueries.create(userFeedback)
        .then(payload => payload)
        .catch(error => error);
};
//========================
