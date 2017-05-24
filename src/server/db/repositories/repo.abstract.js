"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Rx = require("rxjs");
var AbstractRepo = (function () {
    function AbstractRepo(model, converter) {
        this.model = model;
        this.converter = converter;
        this.provider = converter.provider;
    }
    AbstractRepo.prototype.insert = function (obj) {
        var _this = this;
        var source = this.converter.from(obj);
        return source.flatMap(function (obj) {
            return Rx.Observable.fromPromise(_this.model.create(obj));
        });
    };
    AbstractRepo.prototype.insertMany = function (objs) {
        var _this = this;
        var sources = [];
        for (var _i = 0, objs_1 = objs; _i < objs_1.length; _i++) {
            var obj = objs_1[_i];
            sources.push(this.converter.from(obj));
        }
        return Rx.Observable.zip(sources)
            .flatMap(function (convertedObjs) {
            return Rx.Observable.fromPromise(_this.model.insertMany(convertedObjs));
        });
    };
    AbstractRepo.prototype.update = function (conditions, doc, options) {
        if (options === void 0) { options = { overwrite: false }; }
        return Rx.Observable.fromPromise(this.model.update(conditions, doc, options));
    };
    AbstractRepo.prototype.updateMany = function (conditions, doc) {
        var options = {
            overwrite: true,
            multi: true
        };
        return this.update(conditions, doc, options);
    };
    AbstractRepo.prototype.delete = function (id) {
        return Rx.Observable.fromPromise(this.model.remove({ _id: id }));
    };
    AbstractRepo.prototype.findOne = function (query, projection) {
        return Rx.Observable.fromPromise(this.model.findOne(query, projection));
    };
    AbstractRepo.prototype.findAll = function (query, projection, options) {
        if (query === void 0) { query = {}; }
        return Rx.Observable.fromPromise(this.model.find(query, projection, options).lean());
    };
    AbstractRepo.prototype.aggregate = function (query, group, sort) {
        return Rx.Observable.fromPromise(this.model.aggregate({ $match: query }).group(group).sort(sort));
    };
    AbstractRepo.prototype.idMapping = function (id) {
        var objectId = id.toString();
        if (!objectId.match(/^[0-9a-fA-F]{24}$/)) {
            objectId = '4edd40c86762e0fb12000003'; //dummy
        }
        var apiDetailId = "api_detail." + this.provider + ".id";
        return this.model.findOne()
            .or([(_a = {}, _a[apiDetailId] = id, _a), { _id: objectId }])
            .lean()
            .then(this.mapPartial);
        var _a;
    };
    AbstractRepo.prototype.nameMapping = function (name) {
        var q = {
            $or: [
                { 'name': name },
                { 'shortName': name },
                { 'aliases': name }
            ]
        };
        return this.model.findOne(q)
            .then(this.mapPartial);
    };
    AbstractRepo.prototype.findByIdAndUpdate = function (id, obj) {
        var _this = this;
        var source = this.converter.from(obj);
        return source.flatMap(function (obj) {
            var api_detail = obj.api_detail;
            delete obj.api_detail;
            var q = { _id: id };
            return Rx.Observable.fromPromise(_this.findOneAndUpdate(q, obj, api_detail));
        });
    };
    AbstractRepo.prototype.findByApiIdAndUpdate = function (apiId, obj) {
        var _this = this;
        if (obj == undefined) {
            obj = apiId;
            apiId = obj.id || obj.identifier;
        }
        var source = this.converter.from(obj);
        return source.flatMap(function (obj) {
            var api_detail = obj.api_detail;
            delete obj.api_detail;
            var apiDetailId = "api_detail." + _this.provider + ".id";
            var q = (_a = {}, _a[apiDetailId] = apiId, _a);
            return Rx.Observable.fromPromise(_this.findOneAndUpdate(q, obj));
            var _a;
        });
    };
    AbstractRepo.prototype.findOneBySlugAndUpdate = function (obj) {
        var _this = this;
        var source = this.converter.from(obj);
        return source.flatMap(function (obj) {
            var api_detail = obj.api_detail, slug = obj.slug;
            delete obj.api_detail;
            var q = { slug: slug };
            return Rx.Observable.fromPromise(_this.findOneAndUpdate(q, obj, api_detail));
        });
    };
    AbstractRepo.prototype.findBySlugAndUpdate = function (objs) {
        var obs = [];
        for (var _i = 0, objs_2 = objs; _i < objs_2.length; _i++) {
            var obj = objs_2[_i];
            obs.push(this.findOneBySlugAndUpdate(obj));
        }
        return Rx.Observable.forkJoin(obs);
    };
    AbstractRepo.prototype.findOneByNameAndUpdate = function (obj) {
        var _this = this;
        var name = obj.name;
        var q = {
            $or: [
                { 'name': name },
                { 'shortName': name },
                { 'aliases': name }
            ]
        };
        var source = this.converter.from(obj);
        return source.flatMap(function (obj) {
            var api_detail = obj.api_detail;
            delete obj.api_detail;
            return Rx.Observable.fromPromise(_this.findOneAndUpdate(q, obj, api_detail));
        });
    };
    AbstractRepo.prototype.findByNameAndUpdate = function (objs) {
        var obs = [];
        for (var _i = 0, objs_3 = objs; _i < objs_3.length; _i++) {
            var obj = objs_3[_i];
            obs.push(this.findOneByNameAndUpdate(obj));
        }
        return Rx.Observable.forkJoin(obs);
    };
    AbstractRepo.prototype.apiDetailIdKey = function () {
        return "api_detail." + this.provider + ".id";
    };
    AbstractRepo.prototype.getByApiId = function (apiId) {
        var apiDetailId = "api_detail." + this.provider + ".id";
        var query = (_a = {}, _a[apiDetailId] = apiId, _a);
        return this.findOne(query);
        var _a;
    };
    AbstractRepo.prototype.getById = function (id) {
        return this.findOne({ _id: id });
    };
    AbstractRepo.prototype.mapPartial = function (obj) {
        var partial = {
            _id: null,
            name: null,
            slug: null,
        };
        partial._id = obj._id;
        if (obj['name']) {
            partial.name = obj.name;
        }
        if (obj['shortName']) {
            partial.name = obj.shortName;
        }
        if (obj['slug']) {
            partial.slug = obj.slug;
        }
        return Promise.resolve(partial);
    };
    AbstractRepo.prototype.findOneAndUpdate = function (query, obj, apiDetail) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.model.findOneAndUpdate(query, obj, { new: true, upsert: true }, function (err, updatedObj) {
                if (err) {
                    return reject(err);
                }
                if (apiDetail == undefined) {
                    resolve(updatedObj);
                }
                else {
                    if (updatedObj['api_detail']) {
                        _.merge(updatedObj, { api_detail: apiDetail });
                        updatedObj.markModified('api_detail');
                    }
                    else {
                        _.extend(updatedObj, { apiDetail: apiDetail });
                    }
                    updatedObj.save(function (err, savedObj) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(savedObj);
                    });
                }
            });
        });
    };
    return AbstractRepo;
}());
exports.AbstractRepo = AbstractRepo;
//# sourceMappingURL=repo.abstract.js.map