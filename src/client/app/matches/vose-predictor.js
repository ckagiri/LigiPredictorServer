var app;
(function (app) {
    var matches;
    (function (matches) {
        'use strict';
        var VosePredictorFactory = /** @class */ (function () {
            function VosePredictorFactory() {
            }
            VosePredictorFactory.prototype.createPredictor = function (odds) {
                return new VosePredictor(odds);
            };
            return VosePredictorFactory;
        }());
        matches.VosePredictorFactory = VosePredictorFactory;
        var VosePredictor = /** @class */ (function () {
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
                var v = new Vose([homeWinWeight, drawWeight, awayWinWeight]);
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
                    this.favoriteVose = new Vose(weights);
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
                    this.underdogVose = new Vose(weights);
                }
                return scores[this.underdogVose.next()];
            };
            VosePredictor.prototype.getDrawScore = function () {
                var scores = ['1-1', '0-0', '2-2'];
                var weights = [116, 72, 52];
                if (this.drawVose == null) {
                    this.drawVose = new Vose(weights);
                }
                return scores[this.drawVose.next()];
            };
            return VosePredictor;
        }());
        var Vose = /** @class */ (function () {
            function Vose(weights) {
                var _this = this;
                this.init = function (weights) {
                    var large = [];
                    var small = [];
                    var average, less, more;
                    if (!(weights instanceof Array) || weights.length < 1) {
                        throw new Error('Vose: weights must be a non-empty array');
                    }
                    _this.totalDistinctValues = weights.length;
                    _this.probability = [];
                    _this.alias = [];
                    average = 1.0 / _this.totalDistinctValues;
                    weights = normalizeScale(weights.slice(0));
                    for (var i = 0; i < _this.totalDistinctValues; i++) {
                        ((weights[i] >= average) ? large : small).push(i);
                    }
                    while (small.length > 0 && large.length > 0) {
                        less = small.shift();
                        more = large.shift();
                        _this.probability[less] = weights[less] * _this.totalDistinctValues;
                        _this.alias[less] = more;
                        weights[more] = (weights[more] + weights[less]) - average;
                        ((weights[more] >= average) ? large : small).push(more);
                    }
                    while (large.length !== 0) {
                        _this.probability[large.shift()] = 1;
                    }
                    while (small.length !== 0) {
                        _this.probability[small.shift()] = 1;
                    }
                };
                this.next = function () {
                    var column = getRandomInt(0, _this.totalDistinctValues - 1);
                    var coinToss = Math.random() < _this.probability[column];
                    return coinToss ? column : _this.alias[column];
                };
                this.init(weights);
            }
            return Vose;
        }());
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        function normalizeScale(weights) {
            var total = weights.reduce(function (a, b) {
                return a + b;
            });
            if (total > 1) {
                weights = weights.map(function (value) {
                    return value / total;
                });
            }
            else if (total < 1) {
                weights.push(1 - total);
            }
            return weights;
        }
        angular
            .module('app.matches')
            .service('vosePredictorFactory', VosePredictorFactory);
    })(matches = app.matches || (app.matches = {}));
})(app || (app = {}));
//# sourceMappingURL=vose-predictor.js.map