"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var CompetitionApi = (function () {
    function CompetitionApi(apiKey, id) {
        this.apiKey = apiKey;
        this.id = id;
    }
    CompetitionApi.prototype.getTeams = function () {
        var apiResource = "/competitions/" + this.id + "/teams";
        return utils_1.makeRequest(this.apiKey, apiResource);
    };
    CompetitionApi.prototype.getFixtures = function (options) {
        var queryParams = options ? options : undefined;
        var apiResource = "/competitions/" + this.id + "/fixtures";
        return utils_1.makeRequest(this.apiKey, apiResource, queryParams);
    };
    return CompetitionApi;
}());
exports.default = CompetitionApi;
//# sourceMappingURL=competition.js.map