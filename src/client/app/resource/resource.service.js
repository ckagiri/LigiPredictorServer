var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        ResourceFactory.$inject = ['config', '$http', '$q'];
        function ResourceFactory(config, $http, $q) {
            return function (resourceName) {
                var url = config.baseUrl + '/api/' + resourceName;
                var defaultParams = {};
                var Resource;
                Resource = (function () {
                    function Resource(data) {
                        angular.extend(this, data);
                    }
                    Resource.newInstance = function (data) {
                        return new Resource(data);
                    };
                    Resource.all = function (cb, errorcb) {
                        return Resource.query({}, cb, errorcb);
                    };
                    Resource.getList = function (endpoint, parameters, successcb, errorcb) {
                        var epUrl = constructUrl(url + endpoint, parameters);
                        var httpPromise = $http.get(epUrl, defaultParams);
                        return Resource.thenFactoryMethod(httpPromise, successcb, errorcb, true);
                    };
                    Resource.getOne = function (endpoint, parameters, successcb, errorcb) {
                        var epUrl = constructUrl(url + endpoint, parameters);
                        var httpPromise = $http.get(epUrl, defaultParams);
                        return Resource.thenFactoryMethod(httpPromise, successcb, errorcb);
                    };
                    Resource.query = function (params, successcb, errorcb) {
                        var httpPromise = $http.get(url, { params: angular.extend({}, defaultParams, params) });
                        return Resource.thenFactoryMethod(httpPromise, successcb, errorcb, true);
                    };
                    Resource.getById = function (id, successcb, errorcb) {
                        var httpPromise = $http.get(url + '/' + id, { params: defaultParams });
                        return Resource.thenFactoryMethod(httpPromise, successcb, errorcb);
                    };
                    Resource.prototype.id = function () {
                        if (this._id) {
                            return this._id;
                        }
                        return "";
                    };
                    Resource.prototype.create = function (successcb, errorcb) {
                        var httpPromise = $http.post(url, this, { params: defaultParams });
                        return Resource.thenFactoryMethod(httpPromise, successcb, errorcb);
                    };
                    Resource.prototype.update = function (successcb, errorcb) {
                        var httpPromise = $http.put(url + "/" + this.id(), angular.extend({}, this, { _id: undefined }), { params: defaultParams });
                        return Resource.thenFactoryMethod(httpPromise, successcb, errorcb);
                    };
                    Resource.prototype.remove = function (successcb, errorcb) {
                        var httpPromise = $http['delete'](url + "/" + this.id(), { params: defaultParams });
                        return Resource.thenFactoryMethod(httpPromise, successcb, errorcb);
                    };
                    Resource.prototype.save = function (savecb, updatecb, errorSavecb, errorUpdatecb) {
                        if (this.id()) {
                            return this.update(updatecb, errorUpdatecb);
                        }
                        else {
                            return this.create(savecb, errorSavecb);
                        }
                    };
                    Resource.thenFactoryMethod = function (httpPromise, successcb, errorcb, isArray) {
                        var scb = successcb || angular.noop;
                        var ecb = errorcb || angular.noop;
                        return httpPromise.then(function (response) {
                            var result;
                            if (isArray) {
                                result = [];
                                for (var i = 0; i < response.data.length; i++) {
                                    result.push(new Resource(response.data[i]));
                                }
                            }
                            else {
                                if (response.data === " null ") {
                                    return $q.reject({
                                        code: 'resource.notfound',
                                        resource: resourceName
                                    });
                                }
                                else {
                                    result = new Resource(response.data);
                                }
                            }
                            scb(result, response.status, response.headers, response.config);
                            return result;
                        }, function (response) {
                            ecb(undefined, response.status, response.headers, response.config);
                            return undefined;
                        });
                    };
                    return Resource;
                }());
                return Resource;
            };
        }
        //('https://your.domain.here/hero?name=:name', { name: name })
        //('https://your.domain.here/hero/:id', {id: id})
        function constructUrl(endpoint, parameters) {
            var formatted = endpoint;
            var tokens = parameters;
            var query = {};
            for (var propName in tokens) {
                var propValue = tokens[propName];
                var temp = formatted.replace(':' + propName, propValue);
                if (temp === formatted) {
                    query[propName] = propValue;
                }
                formatted = temp;
            }
            var querystring = toQueryString(query);
            if (formatted && querystring) {
                if (formatted.indexOf('?') !== -1) {
                    formatted = formatted + querystring;
                }
                else {
                    formatted = formatted + "?" + querystring;
                }
            }
            return formatted;
        }
        function toQueryString(keyValuePair) {
            var queryString = '';
            for (var key in keyValuePair) {
                if (keyValuePair.hasOwnProperty(key)) {
                    var value = keyValuePair[key];
                    if (queryString) {
                        queryString += '&';
                    }
                    queryString += key + "=" + value;
                }
            }
            return queryString;
        }
        angular
            .module('app.core')
            .factory('resource', ResourceFactory);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=resource.service.js.map