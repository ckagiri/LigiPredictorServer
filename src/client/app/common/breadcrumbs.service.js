var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        var BreadcrumbsService = (function () {
            function BreadcrumbsService() {
                this.breadcrumbs = [];
            }
            BreadcrumbsService.prototype.getAll = function () {
                return this.breadcrumbs;
            };
            BreadcrumbsService.prototype.setAll = function (items) {
                this.breadcrumbs = items;
            };
            BreadcrumbsService.prototype.getFirst = function () {
                return this.breadcrumbs[0] || {};
            };
            return BreadcrumbsService;
        }());
        core.BreadcrumbsService = BreadcrumbsService;
        angular
            .module('app.core')
            .service('breadcrumbs', BreadcrumbsService);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=breadcrumbs.service.js.map