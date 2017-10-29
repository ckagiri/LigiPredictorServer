"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vose_1 = require("./vose");
var VosePredictor = (function () {
    function VosePredictor(odds) {
        if (odds === void 0) { odds = {}; }
        this.underdogVose = null;
        this.drawVose = null;
        this.favoriteVose = null;
        if (odds == null) {
            odds = {};
        }
        var homeWin = odds.homeWin, awayWin = odds.awayWin, draw = odds.draw;
        this.homeWinOdds = homeWin || 1;
        this.awayWinOdds = awayWin || 1;
        this.drawOdds = draw || 1;
    }
    VosePredictor.prototype.predict = function () {
        var underdogWeight;
        var favoriteWeight;
        var homeWinWeight = Math.round((1 / this.homeWinOdds) * 100);
        var drawWeight = Math.round((1 / this.drawOdds) * 100);
        var awayWinWeight = Math.round((1 / this.awayWinOdds) * 100);
        var v = new vose_1.Vose([homeWinWeight, drawWeight, awayWinWeight]);
        var outcomes = ['HOME', 'DRAW', 'AWAY'];
        var outcome = outcomes[v.next()];
        var score = '';
        if (outcome === 'HOME') {
            if (homeWinWeight > awayWinWeight) {
                score = this.getFavouriteScore(true);
            }
            else {
                score = this.getUnderdogScore(true);
            }
        }
        if (outcome === 'AWAY') {
            if (awayWinWeight > homeWinWeight) {
                score = this.getFavouriteScore(false);
            }
            else {
                score = this.getUnderdogScore(false);
            }
        }
        if (outcome === 'DRAW') {
            score = this.getDrawScore();
        }
        return score;
    };
    VosePredictor.prototype.getFavouriteScore = function (isHomeTeam) {
        var scores;
        var weights;
        if (isHomeTeam) {
            scores = ['1-0', '2-1', '2-0', '3-1', '3-0', '3-2'];
            weights = [98, 89, 81, 52, 48, 28];
        }
        else {
            scores = ['0-1', '1-2', '0-2', '1-3', '0-3', '2-3'];
            weights = [63, 56, 34, 23, 18, 14];
        }
        if (this.favoriteVose == null) {
            this.favoriteVose = new vose_1.Vose(weights);
        }
        return scores[this.favoriteVose.next()];
    };
    VosePredictor.prototype.getUnderdogScore = function (isHomeTeam) {
        var scores;
        var weights;
        if (isHomeTeam) {
            scores = ['1-0', '2-1', '2-0'];
            weights = [98, 89, 81];
        }
        else {
            scores = ['0-1', '1-2', '0-2'];
            weights = [63, 56, 34];
        }
        if (this.underdogVose == null) {
            this.underdogVose = new vose_1.Vose(weights);
        }
        return scores[this.underdogVose.next()];
    };
    VosePredictor.prototype.getDrawScore = function () {
        var scores = ['1-1', '0-0', '2-2'];
        var weights = [116, 72, 52];
        if (this.drawVose == null) {
            this.drawVose = new vose_1.Vose(weights);
        }
        return scores[this.drawVose.next()];
    };
    return VosePredictor;
}());
exports.VosePredictor = VosePredictor;
//# sourceMappingURL=vose-predictor.js.map