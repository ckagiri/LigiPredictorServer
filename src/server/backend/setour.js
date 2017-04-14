"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var notfound_1 = require("./utils/notfound");
var data = require("./data");
router.get('/people', getPeople);
router.get('/person/:id', getPerson);
router.get('/*', notfound_1.notFoundMiddleware);
module.exports = router;
function getPeople(req, res, next) {
    res.status(200).send(data.getPeople());
}
function getPerson(req, res, next) {
    var id = +req.params.id;
    var person = data.getPeople().filter(function (p) {
        return p.id === id;
    })[0];
    if (person) {
        res.status(200).send(person);
    }
    else {
        notfound_1.send404(req, res, 'person ' + id + ' not found');
    }
}
//# sourceMappingURL=setour.js.map