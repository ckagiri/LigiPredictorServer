"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var repo_abstract_1 = require("./repo.abstract");
var factory_model_1 = require("./factory.model");
var SeasonRepo = (function (_super) {
    __extends(SeasonRepo, _super);
    function SeasonRepo(converter) {
        return _super.call(this, factory_model_1.modelFactory.seasonModel, converter) || this;
    }
    SeasonRepo.prototype.findByYear = function (year) {
        return this.findAll({ year: year });
    };
    return SeasonRepo;
}(repo_abstract_1.AbstractRepo));
exports.SeasonRepo = SeasonRepo;
//# sourceMappingURL=repo.season.js.map