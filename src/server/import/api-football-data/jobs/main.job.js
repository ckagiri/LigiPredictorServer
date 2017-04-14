"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../../config/environment");
var api_football_data_1 = require("../../../soccer-api-client/api-football-data");
var competition_job_1 = require("./competition.job");
exports.client = new api_football_data_1.default(environment_1.config.api_providers.api_football_data.apiKey);
var MainJob = (function () {
    function MainJob() {
    }
    MainJob.prototype.start = function (queue) {
        console.log("Main job");
        return exports.client.getCompetitions(2016).then(function (_a) {
            var competitions = _a.data;
            for (var _i = 0, competitions_1 = competitions; _i < competitions_1.length; _i++) {
                var competition = competitions_1[_i];
                var compJob = new competition_job_1.default(competition);
                if (competition.id !== 426) {
                    continue;
                }
                queue.addJob(compJob);
            }
        }).catch(function (err) {
            console.error(err);
        });
    };
    return MainJob;
}());
exports.MainJob = MainJob;
//# sourceMappingURL=main.job.js.map