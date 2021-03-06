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
    FootballApiClient.prototype.getFixtures = function (compId, options) {
        var queryParams = options ? options : undefined;
        var apiResource = "/competitions/" + compId + "/fixtures";
        return utils_1.makeRequest(this.apiKey, apiResource, queryParams);
    };
    FootballApiClient.prototype.getFixture = function (compId, id) {
        var apiResource = "/fixtures/" + id;
        return utils_1.makeRequest(this.apiKey, apiResource, undefined);
    };
    return FootballApiClient;
}());
exports.default = FootballApiClient;
//# sourceMappingURL=index.js.map