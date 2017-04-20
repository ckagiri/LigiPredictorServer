"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express = require("express");
var favicon = require("serve-favicon");
var logger = require("morgan");
var bodyParser = require("body-parser");
var notfound_1 = require("./utils/notfound");
var routes_1 = require("./routes");
var environment_1 = require("../config/environment");
var app = express();
app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/api', routes_1.routes);
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
// mongoose.connect(config.mongo.uri, config.mongo.options);
// const db = mongoose.connection;
var server = app.listen(environment_1.config.port, environment_1.config.ip, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Express Server listening at http://" + host + ":" + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
    // db.on('error', (err: any) => {
    //   console.error(`ERROR CONNECTING TO MONGO: ${err}`);
    //   console.error(`Please make sure that ${config.mongo.uri} is running.`);
    // });
    // db.once('open', () => {
    //   console.info(`Connected to MongoDB: ${config.mongo.uri}`);
    // });
});
exports.server = server;
//# sourceMappingURL=server.js.map