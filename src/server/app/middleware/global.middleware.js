"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (app) {
    app.use(function (req, res, next) {
        if (req.query.id) {
            req.query._id = req.query.id;
            delete req.query.id;
        }
        next();
    });
};
//# sourceMappingURL=global.middleware.js.map