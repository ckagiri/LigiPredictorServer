"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vose_1 = require("./vose");
var weights = [40, 10, 30];
var v = new vose_1.Vose(weights);
var VosePredictor = (function () {
    function VosePredictor(odds) {
        this.awayWinVose = null;
        this.drawVose = null;
        this.homeWinVose = null;
        var homeWin = odds.homeWin, awayWin = odds.awayWin, draw = odds.draw;
        this.homeWinOdds = homeWin;
        this.awayWinOdds = awayWin;
        this.drawOdds = draw;
    }
    VosePredictor.prototype.predict = function () {
        var homeWinWeight = Math.round((1 / this.homeWinOdds) * 100);
        var drawWeight = Math.round((1 / this.drawOdds) * 100);
        var awayWinWeight = Math.round((1 / this.awayWinOdds) * 100);
        var weights = [homeWinWeight, drawWeight, awayWinWeight];
        var v = new vose_1.Vose(weights);
        var outcomes = ['HOME', 'DRAW', 'AWAY'];
        var outcome = outcomes[v.next()];
        var score = '';
        if (outcome === 'HOME') {
            console.log(homeWinWeight);
            score = this.getHomeWinScore();
        }
        if (outcome === 'AWAY') {
            console.log(awayWinWeight);
            score = this.getAwayWinScore();
        }
        if (outcome === 'DRAW') {
            console.log(drawWeight);
            score = this.getDrawScore();
        }
        console.log(score);
    };
    VosePredictor.prototype.getHomeWinScore = function () {
        var scores = ['1-0', '2-0', '3-0', '4-0', '2-1', '3-1', '4-1', '3-2', '4-2'];
        var weights = [98, 81, 48, 23, 89, 52, 25, 28, 14];
        if (this.homeWinVose == null) {
            this.homeWinVose = new vose_1.Vose(weights);
        }
        return scores[this.homeWinVose.next()];
    };
    VosePredictor.prototype.getAwayWinScore = function () {
        var scores = ['0-1', '0-2', '0-3', '1-2', '1-3', '2-3'];
        var weights = [63, 34, 14, 56, 23, 18];
        if (this.awayWinVose == null) {
            this.awayWinVose = new vose_1.Vose(weights);
        }
        return scores[this.awayWinVose.next()];
    };
    VosePredictor.prototype.getDrawScore = function () {
        var scores = ['0-0', '1-1', '2-2', '3-3'];
        var weights = [72, 116, 52, 11];
        if (this.drawVose == null) {
            this.drawVose = new vose_1.Vose(weights);
        }
        return scores[v.next()];
    };
    return VosePredictor;
}());
var predictor = new VosePredictor({ homeWin: 1.61, draw: 3.75, awayWin: 5.5 });
for (var i = 0; i < 12; i++) {
    console.log(i);
    predictor.predict();
}
//# sourceMappingURL=vose-predictor.js.map