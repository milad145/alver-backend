const fs = require('fs');
const shell = require('shelljs');
const bytes = require('bytes');
const config = require('config');
const _ = require('lodash');
const gm = require('gm').subClass({imageMagick: true});
//=======================================
const uploadConfig = config.get('uploads');
//=======================================
const errorHandler = require('./errorHandler');
//=======================================

exports.uploadBase64 = (file, title, dest, type) => {
    let __this = this;
    let imageTypeRegularExpression = /\/(.*?)$/;
    let imageBuffer = this.decodeBase64Image(file);
    let userUploadedFeedMessagesLocation = dest;
    let uniqueRandomImageName = title;
    let imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);
    let userUploadedImagePath = userUploadedFeedMessagesLocation + uniqueRandomImageName + '.' + imageTypeDetected[1];
    shell.mkdir('-p', dest);
    return new Promise((resolve, reject) => {
        __this.checkSize(file, type)
            .then(() => {
                fs.writeFile(userUploadedImagePath, imageBuffer.data, (err) => {
                    if (err) reject(err);
                    else resolve(userUploadedImagePath)
                })
            })
            .catch(err => {
                reject(err)
            })
    })
};

exports.decodeBase64Image = (dataString) => {
    let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string')
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response
};

exports.checkSize = (dataString, type) => {
    return new Promise((resolve, reject) => {
        const maxSize = bytes(uploadConfig[type].maxSize);
        dataString = dataString.split('base64,')[1];
        let fileSize = parseInt((dataString).replace(/=/g, "").length * 0.75);
        if (fileSize > maxSize) {
            let err = errorHandler.errorCode(1501);
            reject({code: err.code, message: err.message, type: type, fileSize: fileSize, maxSize: maxSize})
        }
        resolve(true)
    })
};

exports.createThumb = (path, dest, name, w, h, q) => {
    return new Promise((resolve, reject) => {
        if (path && dest && name && w && h && q) {
            let realName = name.split("/");
            realName[realName.length - 1] = w + "x" + h + "_" + realName[realName.length - 1];
            let newName = '';
            _.each(realName, (x, k) => {
                newName += x;
                if (k < realName.length - 1) {
                    newName += '/'
                }
            });
            gm(path).thumb(w, h, dest + newName, q, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(dest + newName)
                }
            });
        } else {
            reject(false)
        }
    })
};
