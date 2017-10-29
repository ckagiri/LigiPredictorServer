namespace app.matches {
  'use strict';

  export class VosePredictorFactory {
    createPredictor(odds: any) {
      return new VosePredictor(odds);
    }
  }

  class VosePredictor{
    constructor(odds: any = {}) {
      let {homeWin, awayWin, draw} = odds;
      this.homeWinOdds = homeWin || 1;
      this.awayWinOdds = awayWin || 1;
      this.drawOdds = draw || 1;
    }

    homeWinOdds: number;
    drawOdds: number;
    awayWinOdds: number;
    underdogVose: any = null;
    drawVose: any = null;
    favoriteVose: any = null;

    predict() {
      let underdogWeight: number;
      let favoriteWeight: number;
      let homeWinWeight = Math.round((1 / this.homeWinOdds) * 100);
      let drawWeight = Math.round((1 / this.drawOdds) * 100);
      let awayWinWeight = Math.round((1 / this.awayWinOdds) * 100);
      let v = new Vose([homeWinWeight, drawWeight, awayWinWeight]);
      let outcomes: string[] = ['HOME','DRAW','AWAY']
      let outcome = outcomes[v.next()]
      let score = '';
      if (outcome === 'HOME') {
        if(homeWinWeight > awayWinWeight) {
          score = this.getFavouriteScore(true);
        } else {
          score = this.getUnderdogScore(true);
        }
      }
      if (outcome === 'AWAY') {
        if(awayWinWeight > homeWinWeight) {
          score = this.getFavouriteScore(false);
        } else {
          score = this.getUnderdogScore(false);
        }
      }
      if (outcome === 'DRAW') {
        score = this.getDrawScore();
      }
      return score;
    } 

    getFavouriteScore(isHomeTeam: boolean) {
      let scores: string[];
      let weights: number[];
      if(isHomeTeam) {
        scores = ['1-0', '2-1', '2-0', '3-1', '3-0', '3-2'] 
        weights = [ 98,    89,    81,    52,    48,    28]
      } else {
        scores = ['0-1', '1-2', '0-2', '1-3', '0-3', '2-3'] 
        weights = [ 63,    56,    34,    23,    18,    14]
      }

      if(this.favoriteVose == null) {
        this.favoriteVose = new Vose(weights);
      }
      return scores[this.favoriteVose.next()]
    }
    
    getUnderdogScore(isHomeTeam: boolean) {
      let scores: string[];
      let weights: number[];
      if(isHomeTeam) {
        scores = ['1-0', '2-1', '2-0'] 
        weights = [ 98,    89,    81]
      } else {
        scores = ['0-1', '1-2', '0-2'] 
        weights = [ 63,    56,    34]
      }
      if(this.underdogVose == null) {
        this.underdogVose = new Vose(weights);
      }
      return scores[this.underdogVose.next()]
    }

    getDrawScore() {
      var scores = ['1-1', '0-0', '2-2'] 
      var weights = [116,    72,    52]
      if(this.drawVose == null) {
        this.drawVose = new Vose(weights);
      }
      return scores[this.drawVose.next()]
    }
  }  
  class Vose {
    constructor(weights: number[]) {
      this.init(weights)
    }

    totalDistinctValues: number;
    probability: number[];
    alias:number[];

    init = (weights: number[]) => {
      let large: number[] = [];
      let small: number[] = [];
      let average, less, more;

      if (!(weights instanceof Array) || weights.length < 1) {
        throw new Error('Vose: weights must be a non-empty array');
      }

      this.totalDistinctValues = weights.length;
      this.probability = [];
      this.alias = [];
      average = 1.0 / this.totalDistinctValues;
      weights = normalizeScale(weights.slice(0));

      for (var i = 0; i < this.totalDistinctValues; i++) {
        ((weights[i] >= average) ? large : small).push(i);
      }

      while (small.length > 0 && large.length > 0) {
        less = small.shift();
        more = large.shift();

        this.probability[less] = weights[less] * this.totalDistinctValues;
        this.alias[less] = more;

        weights[more] = (weights[more] + weights[less]) - average;
        ((weights[more] >= average) ? large : small).push(more);
      }

      while (large.length !== 0) {
        this.probability[large.shift()] = 1;
      }

      while (small.length !== 0) {
        this.probability[small.shift()] = 1;
      }
    }

    next = () => {
      let column = getRandomInt(0, this.totalDistinctValues - 1);
      let coinToss = Math.random() < this.probability[column];
      return coinToss ? column : this.alias[column];
    }
  }

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function normalizeScale(weights: number[]) {
    var total = weights.reduce((a, b) => {
      return a + b;
    });

    if (total > 1) {
      weights = weights.map((value) => {
        return value / total;
      });
    } else if (total < 1) {
      weights.push(1 - total);
    }

    return weights;
  }

  angular
    .module('app.matches')
    .service('vosePredictorFactory', VosePredictorFactory);
}