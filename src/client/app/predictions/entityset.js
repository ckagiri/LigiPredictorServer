var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        factory.$inject = ['$window'];
        function factory($window) {
            var _ = $window._;
            var EntitySet = (function () {
                function EntitySet(Model) {
                    this.items = {};
                    this.isEmpty = function () {
                        for (var prop in this.items) {
                            if (this.items.hasOwnProperty(prop)) {
                                return false;
                            }
                        }
                        return true;
                    };
                    this.getCount = function () {
                        return Object.keys(this.items).length;
                    };
                    this.getFilteredCount = function (filter) {
                        return this.itemsToArray(filter).length;
                    };
                    this.Model = Model;
                    var key = Model.key;
                    var idKey = function (n) {
                        return n == undefined ? null : n.id;
                    }; // default
                    if (typeof (key) === "string") {
                        idKey = function (n) { return n[key]; };
                    }
                    if (typeof (key) === "function") {
                        idKey = key;
                    }
                    this.idKey = idKey;
                }
                EntitySet.prototype.mapDtoListToContext = function (dtoList) {
                    var _this = this;
                    if (!_.isArray(dtoList))
                        dtoList = [];
                    this.items = dtoList.reduce(function (memo, dto) {
                        var id = _this.idKey(dto);
                        var item = _this.items[id];
                        if (item) {
                            angular.extend(item, dto);
                        }
                        else {
                            var Model = _this.Model;
                            item = new Model(dto);
                        }
                        memo[id] = item;
                        return memo;
                    }, {});
                };
                EntitySet.prototype.mapDtoToContext = function (dto) {
                    var id = this.idKey(dto);
                    if (!id)
                        throw new Error('id not defined');
                    var item = this.items[id];
                    if (item) {
                        angular.extend(item, dto);
                    }
                    else {
                        var Model = this.Model;
                        item = new Model(dto);
                    }
                    this.items[id] = item;
                    return this.items[id];
                };
                EntitySet.prototype.add = function (newObj) {
                    var id = this.idKey(newObj);
                    this.items[id] = newObj;
                    return this.items[id];
                };
                EntitySet.prototype.removeById = function (id) {
                    delete this.items[id];
                };
                EntitySet.prototype.getById = function (id) {
                    return !!id && !!this.items[id] ? this.items[id] : this.Model['nullo'];
                };
                EntitySet.prototype.getAll = function (options) {
                    if (options === void 0) { options = {}; }
                    var filter = options.filter, sortFn = options.sortFn, page = options.page, size = options.size;
                    return this.itemsToArray(filter, sortFn, page, size);
                };
                EntitySet.prototype.clear = function () {
                    for (var prop in this.items) {
                        if (this.items.hasOwnProperty(prop)) {
                            delete this.items[prop];
                        }
                    }
                };
                EntitySet.prototype.itemsToArray = function (filter, sortFn, page, size) {
                    var result = this.mapMemoToArray();
                    if (filter) {
                        result = result.filter(function (o) {
                            var match = filter.predicate(o);
                            return match;
                        });
                    }
                    if (sortFn) {
                        result.sort(sortFn);
                    }
                    if (page && size) {
                        var start = (page - 1) * size;
                        result = result.slice(start, start + size);
                    }
                    return result;
                };
                EntitySet.prototype.mapMemoToArray = function () {
                    var array = [];
                    for (var prop in this.items) {
                        if (this.items.hasOwnProperty(prop)) {
                            array.push(this.items[prop]);
                        }
                    }
                    return array;
                };
                return EntitySet;
            }());
            return EntitySet;
        }
        angular.module('app.core').factory('EntitySet', factory);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=entityset.js.map