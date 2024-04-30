const config = require("config");
const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const uploader = require('./uploader');
const errHndlr = require('./errorHandler');

exports.show = (subDir, img, size) => {
  let uploadDir = "/uploads/";
  if (subDir != null) {
    uploadDir = uploadDir + subDir + "/";
  }
  let upPath = appDir + uploadDir + img;
  let mianImg = upPath;
  if (size) {
    upPath = appDir + uploadDir + size + "_" + img;
  }
  return new Promise((resolve, reject) => {
    fs.readFile(upPath, (err, data) => {
      if (!data) {
        if (!isMainSizeExist(mianImg)) {
          reject(errHndlr.errorCode(1502))
        } else {
          let aPath = appDir + uploadDir;
          let newName = img;
          let wh = size.split("x");
          uploader.createThumb(mianImg, aPath, newName, wh[0], wh[1], 80)
            .then(payload => {
              fs.readFile(payload, (err, data) => {
                resolve(data)
              });
            })
            .catch(err => {
              reject(err)
            })
        }
      } else {
        resolve(data)
      }
    });
  })
};

exports.isMainSizeExist = (img) => {
  return fs.existsSync(img);
};