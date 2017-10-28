"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vose_1 = require("./vose");
var VosePredictor = (function () {
    function VosePredictor(odds) {
        if (odds === void 0) { odds = {}; }
        this.underdogVose = null;
        this.drawVose = null;
        this.favoriteVose = null;
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
    };
    VosePredictor.prototype.getFavouriteScore = function (isHomeTeam) {
        var scores = [];
        if (isHomeTeam) {
            scores = ['1-0', '2-0', '3-0', '4-0', '2-1', '3-1', '4-1', '3-2', '4-2'];
        }
        else {
            scores = ['0-1', '0-2', '0-3', '0-4', '1-2', '1-3', '1-4', '2-3', '2-4'];
        }
        var weights = [98, 81, 48, 23, 89, 52, 25, 28, 14];
        if (this.favoriteVose == null) {
            this.favoriteVose = new vose_1.Vose(weights);
        }
        return scores[this.favoriteVose.next()];
    };
    VosePredictor.prototype.getUnderdogScore = function (isHomeTeam) {
        var scores = [];
        if (isHomeTeam) {
            scores = ['1-0', '2-0', '2-1', '3-1', '3-2'];
        }
        else {
            scores = ['0-1', '0-2', '1-2', '1-3', '2-3'];
        }
        var weights = [63, 34, 56, 23, 18];
        if (this.underdogVose == null) {
            this.underdogVose = new vose_1.Vose(weights);
        }
        return scores[this.underdogVose.next()];
    };
    VosePredictor.prototype.getDrawScore = function () {
        var scores = ['0-0', '1-1', '2-2', '3-3'];
        var weights = [72, 116, 52, 11];
        if (this.drawVose == null) {
            this.drawVose = new vose_1.Vose(weights);
        }
        return scores[this.drawVose.next()];
    };
    return VosePredictor;
}());
//# sourceMappingURL=vose-predictor.js.map