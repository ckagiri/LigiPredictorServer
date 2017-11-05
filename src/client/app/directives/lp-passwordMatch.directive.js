var app;
(function (app) {
    var directives;
    (function (directives) {
        'use strict';
        var LpPasswordMatch = (function () {
            function LpPasswordMatch() {
                this.require = 'ngModel';
                this.scope = {
                    otherModelValue: '=lpPasswordMatch'
                };
            }
            LpPasswordMatch.instance = function () {
                return new LpPasswordMatch();
            };
            LpPasswordMatch.prototype.link = function (scope, element, attributes, ngModel) {
                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue === scope.otherModelValue;
                };
                scope.$watch('otherModelValue', function () {
                    ngModel.$validate();
                });
            };
            return LpPasswordMatch;
        }());
        LpPasswordMatch.$inject = [''];
        angular
            .module('app.directives')
            .directive('lpPasswordMatch', LpPasswordMatch.instance);
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
//# sourceMappingURL=lp-passwordMatch.directive.js.map