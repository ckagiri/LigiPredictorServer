"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var competition_1 = require("./competition");
var FootballApiClient = (function () {
    function FootballApiClient(apiKey) {
        this.apiKey = apiKey;
    }
    FootballApiClient.prototype.getCompetitions = function (year) {
        var queryParams = year ? { year: year } : undefined;
        var apiResource = "/competitions";
        return utils_1.makeRequest(this.apiKey, apiResource, queryParams);
    };
    FootballApiClient.prototype.getCompetitionById = function (compId) {
        return new competition_1.default(this.apiKey, compId);
    };
    FootballApiClient.prototype.getFixtures = function () {
        var seasonId = "592b2483f9e52d41b0007db4";
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                //LigiApiId
                resolve([{
                        _id: "592b2483f9e52d41b0007db8",
                        season: seasonId,
                        round: 1,
                        status: 'FINISHED',
                        result: {
                            goalsHomeTeam: 1,
                            goalsAwayTeam: 1
                        }
                    }, {
                        _id: "592b2483f9e52d41b0007db9",
                        season: seasonId,
                        round: 1,
                        status: 'FINISHED',
                        result: {
                            goalsHomeTeam: 2,
                            goalsAwayTeam: 1
                        }
                    }]);
            }, 1000);
        });
    };
    return FootballApiClient;
}());
exports.default = FootballApiClient;
//# sourceMappingURL=index.js.map