const config = require("config");
const data = require("../config/data");

const errorHandler = require("../modules/errorHandler");

exports.routes = (app) => {
    app.get("/", (req, res) => {
        res.send(true);
    });

    app.get("/privacy", (req, res) => {
        res.render("privacy");
    });

    app.get("/versions", (req, res) => {
        res.json({versions: config.get("version"), lastChanges: data.lastChanges});
    });

    app.use((req, res, next) => {
        if (req.headers.version && parseInt(req.headers.version.replace(/\./g, "")) >= parseInt(config.get("version")["lastSupportedVersion"].replace(/\./g, ""))) next();
        else {
            const error = errorHandler.errorCode(1001);
            res.status(error.responseCode).send(error);
        }
    });

    app.get("/", (req, res) => res.send("Hello World"));

    app.use("/page", require("../api/pageRoute"));
    app.use("/user", require("../entities/user/route"));
    app.use("/post", require("../entities/post/route"));
    app.use("/category", require("../entities/category/route"));
    app.use("/city", require("../entities/city/route"));
    app.use("/field", require("../entities/field/route"));
    app.use("/feedback", require("../entities/feedback/route"));
};
