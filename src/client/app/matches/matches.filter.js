var app;
(function (app) {
    var matches;
    (function (matches) {
        'use strict';
        angular.module('app.matches').filter('countScore', [
            function () {
                return function (input, number) {
                    var count = 0;
                    angular.forEach(input, function (fixture) {
                        if (fixture.hasOwnProperty('prediction')) {
                            if (fixture.prediction.hasOwnProperty('score')) {
                                if (fixture.prediction.score.score === number) {
                                    count++;
                                }
                            }
                        }
                    });
                    return count;
                };
            }
        ]);
        angular.module('app.matches').filter('calcScore', [
            function () {
                return function (input) {
                    var sum = 0;
                    angular.forEach(input, function (fixture) {
                        if (fixture.hasOwnProperty('prediction')) {
                            if (fixture.prediction.hasOwnProperty('score')) {
                                sum += fixture.prediction.score.score || 0;
                            }
                        }
                    });
                    return sum;
                };
            }
        ]);
    })(matches = app.matches || (app.matches = {}));
})(app || (app = {}));
//# sourceMappingURL=matches.filter.js.map