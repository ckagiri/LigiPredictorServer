var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        var CacheService = /** @class */ (function () {
            function CacheService($cacheFactory) {
                this.$cacheFactory = $cacheFactory;
                this.expires = undefined; //config.storeExpirationMs
                this.store = null;
                this.store = this.$cacheFactory('store');
            }
            CacheService.prototype.clear = function (key) {
                return this.store.put(key, null);
            };
            CacheService.prototype.get = function (key) {
                return this.store.get(key);
            };
            CacheService.prototype.put = function (key, value) {
                return this.store.put(key, value);
            };
            CacheService.prototype.info = function () {
                return this.store.info();
            };
            CacheService.$inject = ['$cacheFactory'];
            return CacheService;
        }());
        core.CacheService = CacheService;
        angular
            .module('app.core')
            .service('cache', CacheService);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=cache.service.js.map