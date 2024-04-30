// ===============================================
// common middleware provide common required data for apis
// ===============================================
'use strict';
// ===============================================
// ===============================================

module.exports = {
    haveINewNotification: function () {
        return function (req, res, next) {
            next()
        }
    }

};
