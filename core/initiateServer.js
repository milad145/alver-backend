const {fork} = require("child_process");
const path = require("path");
const express = require('express');

const bodyParser = require("body-parser");
const config = require("config");
const passport = require("passport");

global.DeleteFilesWorker = null;

exports.initiateServer = () => {
    return function (err) {
        if (!err) {
            DeleteFilesWorker = fork(path.join(__dirname, "..", "workers", "deleteFiles", "deleteFiles.js"));

            // ===============================================
            initialApp();
            initialSite();
        }
        else {
            console.error("server can't connect to database!");
        }
    };
};

function initialApp() {
    const app = express();
    app.set("view engine", "ejs");

    app.use(bodyParser.json({limit: "50mb"}));
    app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));

    app.use(passport.initialize());
    app.use(passport.session());
    require("../middlewares/passport")(passport);

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        next();
    });
    const serveStatic = require("./serveStatic");
    serveStatic.serveStatic(app);
    let apiApp = app;
    // api routes
    const routes = require("./routes");
    routes.routes(apiApp);
    // ===============================================
    const ports = config.get("ports");
    apiApp.listen(ports.app, function () {
        console.log("Express app listening on port " + ports.app + "!");
    });
}

function initialSite() {
    const app = express();
    app.set("view engine", "ejs");

    app.use(bodyParser.json({limit: "50mb"}));
    app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));

    app.use(passport.initialize());
    app.use(passport.session());
    require("../middlewares/passport")(passport);

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        next();
    });
    const serveStatic = require("./serveStatic");
    serveStatic.siteStatic(app);
    let uiApp = app;
    // api routes
    const routes = require("./pageRoutes");
    routes.pageRoutes(uiApp);
    // ===============================================
    const ports = config.get("ports");
    uiApp.listen(ports.site, function () {
        console.log("Express site listening on port " + ports.site + "!");
    });
}
