exports.serveStatic = function (app) {
    const serveStatic = require("serve-static");
    app.use("/image", serveStatic("uploads/images"));
    app.use("/audio", serveStatic("uploads/audios"));
    app.use("/apk", serveStatic("uploads/release"));
    app.use("/category", serveStatic("assets/categories"));
};
exports.siteStatic = function (app) {
    const serveStatic = require("serve-static");
    app.use("/js", serveStatic("views/assets/js"));
    app.use("/style", serveStatic("views/assets/css"));
    app.use("/image", serveStatic("views/assets/images"));
    app.use("/font", serveStatic("views/assets/fonts"));
    app.use("/appImage", serveStatic("uploads/images"));
    app.use("/appAudio", serveStatic("uploads/audios"));
    app.use("/apk", serveStatic("uploads/release"));
    app.use("/appCategory", serveStatic("assets/categories"));
};
