"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");
var routes_1 = require("./routes");
var environment_1 = require("../config/environment");
var favicon = require('serve-favicon');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes_1.routes);
var clientPath = path.join(environment_1.config.root, '../../client');
app.use(favicon(clientPath + '/favicon.ico'));
app.use(express.static(clientPath));
var renderIndex = function (req, res) {
    res.sendFile(clientPath + '/index.html');
};
app.get('/*', renderIndex);
mongoose.connect(environment_1.config.mongo.uri, environment_1.config.mongo.options);
var db = mongoose.connection;
var server = app.listen(environment_1.config.port, environment_1.config.ip, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server listening at http://" + host + ":" + port);
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