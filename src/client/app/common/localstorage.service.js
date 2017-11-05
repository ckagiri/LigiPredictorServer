var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        var LocalStorageService = /** @class */ (function () {
            function LocalStorageService($window) {
                this.localStorage = $window.localStorage;
            }
            LocalStorageService.prototype.getItem = function (key) { return JSON.parse(this.localStorage.getItem(key)); };
            LocalStorageService.prototype.setItem = function (key, value) {
                this.localStorage.setItem(key, JSON.stringify(value));
                return true;
            };
            LocalStorageService.prototype.removeItem = function (key) {
                this.localStorage.removeItem(key);
                return true;
            };
            LocalStorageService.$inject = ['$window'];
            return LocalStorageService;
        }());
        core.LocalStorageService = LocalStorageService;
        angular
            .module('app.core')
            .service('localstorage', LocalStorageService);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=localstorage.service.js.map