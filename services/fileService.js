const multer = require('multer');
const config = require("config");
const uploads = config.get('uploads');
//=================================
module.exports = {
    uploader: (type) => {
        return (req, res, next) => {
            const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    let folder = "images";
                    if (file.fieldname === 'audios') folder = 'audios';
                    else if (file.fieldname === 'images') folder = 'images';
                    else cb({code: 400});
                    cb(null, "./uploads/" + folder)
                },
                filename: (req, file, cb) => {
                    cb(null, (req.user._id + "_" + new Date().getTime() + "_" + file.originalname).replace(/ /g, '_'))
                }
            });
            let upload = multer({
                storage: storage,
                limits: {fileSize: uploads["all"].maxSize}
            }).fields([{name: 'images', maxCount: 5}, {name: 'audios', maxCount: 1}]);
            upload(req, res, (error) => {
                if (error) {
                    return res.status(error.code && typeof error.code === "number" ? error.code : 500).send(error)
                } else {
                    if (req.files && !Object.keys(req.files).length) return next(null);
                    let images = [], audios = [];
                    if (req.files.images)
                        req.files.images.forEach((item) => {
                            images.push({uri: item.filename, filename: item.originalname, size: item.size});
                        });
                    if (req.files.audios)
                        req.files.audios.forEach((item) => {
                            let time = 0;
                            try {
                                time = parseInt(item.originalname.split('_')[0]);
                            } catch (e) {

                            }
                            audios.push({uri: item.filename, size: item.size, time});
                        });
                    req.images = images;
                    req.audios = audios;
                    return next(null)
                }
            });
        }
    }
};
