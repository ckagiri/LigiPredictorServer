var app;
(function (app) {
    var auth;
    (function (auth) {
        'use strict';
        var RetryQueue = (function () {
            function RetryQueue($log, $q) {
                this.$log = $log;
                this.$q = $q;
                this.retryQueue = [];
                this.onItemAddedCallbacks = [];
            }
            RetryQueue.prototype.hasMore = function () {
                return this.retryQueue.length > 0;
            };
            RetryQueue.prototype.push = function (retryItem) {
                var _this = this;
                this.retryQueue.push(retryItem);
                // Call all the onItemAdded callbacks
                angular.forEach(this.onItemAddedCallbacks, function (cb) {
                    try {
                        cb(retryItem);
                    }
                    catch (e) {
                        _this.$log.error('securityRetryQueue.push(retryItem): callback threw an error' + e);
                    }
                });
            };
            RetryQueue.prototype.pushRetryFn = function (reason, retryFn) {
                if (arguments.length === 1) {
                    retryFn = reason;
                    reason = undefined;
                }
                // The deferred object that will be resolved or rejected by calling retry or cancel
                var deferred = this.$q.defer();
                var retryItem = {
                    reason: reason,
                    retry: function () {
                        // Wrap the result of the retryFn into a promise if it is not already
                        this.$q.when(retryFn()).then(function (value) {
                            // If it was successful then resolve our deferred
                            deferred.resolve(value);
                        }, function (value) {
                            // Othewise reject it
                            deferred.reject(value);
                        });
                    },
                    cancel: function () {
                        // Give up on retrying and reject our deferred
                        deferred.reject();
                    }
                };
                this.push(retryItem);
                return deferred.promise;
            };
            RetryQueue.prototype.retryReason = function () {
                return this.hasMore() && this.retryQueue[0].reason;
            };
            RetryQueue.prototype.cancelAll = function () {
                while (this.hasMore()) {
                    this.retryQueue.shift().cancel();
                }
            };
            RetryQueue.prototype.retryAll = function () {
                while (this.hasMore()) {
                    this.retryQueue.shift().retry();
                }
            };
            RetryQueue.prototype.clear = function () {
                this.retryQueue = [];
            };
            return RetryQueue;
        }());
        RetryQueue.$inject = ['$log', '$q'];
        angular
            .module('app.auth')
            .service('retryQueue', RetryQueue);
    })(auth = app.auth || (app.auth = {}));
})(app || (app = {}));
//# sourceMappingURL=retryqueue.js.map