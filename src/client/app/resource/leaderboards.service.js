var app;
(function (app) {
    var core;
    (function (core) {
        'use strict';
        LeaderBoardsResource.$inject = ['resource'];
        function LeaderBoardsResource(resource) {
            var LeaderBoards = resource("leagues");
            return LeaderBoards;
        }
        angular
            .module('app.core')
            .factory('LeaderBoardsResource', LeaderBoardsResource);
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=leaderboards.service.js.map