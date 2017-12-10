var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        var Filter = (function () {
            function Filter() {
            }
            Filter.prototype.modelTest = function (item) {
                // Return true if it meets the filter criteria. Otherwise, return false
                if (this.round === -1)
                    return true;
                if (this.round !== item.round)
                    return false;
                return true;
            };
            Filter.prototype.predicate = function (item) {
                var match = this.modelTest(item);
                return match;
            };
            return Filter;
        }());
        core.Filter = Filter;
        angular.module('app.core').service('predictionFilter', Filter);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=predictions-filter.js.map