var admin;
(function (admin) {
    var fixtures;
    (function (fixtures) {
        'use strict';
        function formatOdds() {
            return function (input) {
                var text = '';
                if (input == null) {
                    text = '1, 1, 1';
                }
                else {
                    var homeWin = input.homeWin;
                    var awayWin = input.awayWin;
                    var draw = input.draw;
                    text = homeWin + ", " + draw + ", " + awayWin;
                }
                return text;
            };
        }
        angular.module('admin.fixtures').filter('formatOdds', formatOdds);
    })(fixtures = admin.fixtures || (admin.fixtures = {}));
})(admin || (admin = {}));
//# sourceMappingURL=format-odds.filter.js.map