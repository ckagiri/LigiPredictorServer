import {Vose} from './vose';
var weights = [40, 10, 30]
var v = new Vose(weights);

class VosePredictor{
  constructor(odds: any) {
    let {homeWin, awayWin, draw} = odds;
    this.homeWinOdds = homeWin;
    this.awayWinOdds = awayWin;
    this.drawOdds = draw;
  }

  homeWinOdds: number;
  drawOdds: number;
  awayWinOdds: number;
  awayWinVose: any = null;
  drawVose: any = null;
  homeWinVose: any = null;

  predict() {
    let homeWinWeight = Math.round((1 / this.homeWinOdds) * 100);
    let drawWeight = Math.round((1 / this.drawOdds) * 100);
    let awayWinWeight = Math.round((1 / this.awayWinOdds) * 100);
    let weights = [homeWinWeight, drawWeight, awayWinWeight];
    let v = new Vose(weights);
    let outcomes: string[] = ['HOME','DRAW','AWAY']
    let outcome = outcomes[v.next()]
    let score = '';
    if (outcome === 'HOME') {
      console.log(homeWinWeight)
      score = this.getHomeWinScore();
    }
    if (outcome === 'AWAY') {
      console.log(awayWinWeight)
      score = this.getAwayWinScore();
    }
    if (outcome === 'DRAW') {
      console.log(drawWeight)
      score = this.getDrawScore();
    }
    console.log(score);
  } 

  getHomeWinScore() {
    var scores = ['1-0', '2-0', '3-0', '4-0', '2-1', '3-1', '4-1', '3-2', '4-2'] 
    var weights = [  98,    81,    48,    23,    89,    52,    25,    28,   14]
    if(this.homeWinVose == null) {
      this.homeWinVose = new Vose(weights);
    }
    return scores[this.homeWinVose.next()]
  }
  
  getAwayWinScore() {
    var scores = ['0-1', '0-2', '0-3', '1-2', '1-3', '2-3'] 
    var weights = [  63,    34,    14,    56,    23,   18]
    if(this.awayWinVose == null) {
      this.awayWinVose = new Vose(weights);
    }
    return scores[this.awayWinVose.next()]
  }

  getDrawScore() {
    var scores = ['0-0', '1-1', '2-2', '3-3'] 
    var weights = [  72,   116,    52,   11]
    if(this.drawVose == null) {
      this.drawVose = new Vose(weights);
    }
    return scores[v.next()]
  }
}  