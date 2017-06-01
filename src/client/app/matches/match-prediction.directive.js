var app;
(function (app) {
    var matches;
    (function (matches) {
        'use strict';
        angular.module('app.matches').directive('matchPrediction', [
            function () {
                return {
                    restrict: 'E',
                    templateUrl: 'app/matches/match-prediction.html'
                };
            }
        ]);
    })(matches = app.matches || (app.matches = {}));
})(app || (app = {}));
//# sourceMappingURL=match-prediction.directive.js.map