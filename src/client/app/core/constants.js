/* global toastr:false, moment:false */
var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        angular
            .module('app.core')
            .constant('toastr', toastr)
            .constant('moment', moment);
        angular.module('app.core')
            .factory('_', ['$window', function ($window) {
                return $window._;
            }]);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=constants.js.map