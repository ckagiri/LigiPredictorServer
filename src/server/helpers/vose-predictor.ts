import {Vose} from './vose';

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
  } 

  getFavouriteScore(isHomeTeam: boolean) {
    let scores: string[] = [];
    if(isHomeTeam) {
      scores = ['1-0', '2-0', '3-0', '4-0', '2-1', '3-1', '4-1', '3-2', '4-2'] 
    } else {
      scores = ['0-1', '0-2', '0-3', '0-4', '1-2', '1-3', '1-4', '2-3', '2-4'] 
    }
    let weights = [98,    81,    48,    23,    89,    52,    25,    28,   14]

    if(this.favoriteVose == null) {
      this.favoriteVose = new Vose(weights);
    }
    return scores[this.favoriteVose.next()]
  }
  
  getUnderdogScore(isHomeTeam: boolean) {
    let scores: string[] = [];
    if(isHomeTeam) {
      scores = ['1-0', '2-0', '2-1', '3-1', '3-2'] 
    } else {
      scores = ['0-1', '0-2', '1-2', '1-3', '2-3'] 
    }
    let weights = [63,    34,    56,    23,   18]
    if(this.underdogVose == null) {
      this.underdogVose = new Vose(weights);
    }
    return scores[this.underdogVose.next()]
  }

  getDrawScore() {
    var scores = ['0-0', '1-1', '2-2', '3-3'] 
    var weights = [  72,   116,    52,   11]
    if(this.drawVose == null) {
      this.drawVose = new Vose(weights);
    }
    return scores[this.drawVose.next()]
  }
}  