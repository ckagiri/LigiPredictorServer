"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express = require("express");
var favicon = require("serve-favicon");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var notfound_1 = require("./utils/notfound");
var authRoutes_1 = require("./authRoutes");
var apiRoutes_1 = require("./apiRoutes");
var environment_1 = require("../config/environment");
var Promise = require('bluebird');
mongoose.Promise = Promise;
var app = express();
app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(function (req, res, next) {
    if (req.path.substr(-1) == '/' && req.path.length > 1) {
        var query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -1) + query);
    }
    else {
        next();
    }
});
app.use('/auth', authRoutes_1.routes);
app.use('/api', apiRoutes_1.routes);
console.log('About to crank up node');
console.log('PORT=' + environment_1.config.port);
console.log('NODE_ENV=' + environment_1.config.env);
switch (environment_1.config.env) {
    case 'build':
    case 'production':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function (req, res, next) {
            notfound_1.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function (req, res, next) {
            notfound_1.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./src/client/index.html'));
        break;
}
mongoose.connect(environment_1.config.mongo.uri, environment_1.config.mongo.options);
var db = mongoose.connection;
var server = app.listen(environment_1.config.port, environment_1.config.ip, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(environment_1.config.env + " Express Server listening on http://localhost:" + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
    db.on('error', function (err) {
        console.error("ERROR CONNECTING TO MONGO: " + err);
        console.error("Please make sure that " + environment_1.config.mongo.uri + " is running.");
    });
    db.once('open', function () {
        console.info("Connected to MongoDB: " + environment_1.config.mongo.uri);
    });
});
exports.server = server;
//# sourceMappingURL=server.js.map