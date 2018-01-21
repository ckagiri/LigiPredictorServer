namespace app.rules {
	'use strict';

	export class RulesController {
		static $inject: string[] = ['$q', 'logger'];

		constructor(private $q: ng.IQService,
      private logger: blocks.logger.Logger) {
				this.activate();
    }
		
		title: string = 'Rules';
		goalsRange = [0,1,2,3,4,5,6,7,8,9];
		isCorrectOutcome: false;
		homeScoreResult: number = 0;
		awayScoreResult: number = 0;
		homeScorePrediction: number = 0;
		awayScorePrediction: number = 0;
		hasJoker: boolean = false;		
		points: any = {
			rules:  {
				RULE_1: {id: '1', show: false, value: 0, name: 'Correct Match Outcome'},
				RULE_2: {id: '2', show: false, value: 0, name: 'Correct Goal Difference'},
				RULE_3: {id: '3', show: false, value: 0, name: 'Correct Team Score'},
				RULE_4: {id: '4', show: false, value: 0, name: 'Exact Match Score'},
				RULE_5: {id: '5', show: false, value: 0, name: 'Team Score of 2 or more'},
				RULE_6: {id: '6', show: false, value: 0, name: 'Within 1 goal of Match Score'}
			},
			value: 0
		};
		defaultPoints: any;
		goalDiff: any = {
			rules: {
        RULE_1: {id: '1', show: false, value: 2, name: 'Starting Goal Difference (Default)'},
        RULE_2: {id: '2', show: false, value: 0, name: 'Correct Team Score (Gain)'},
        RULE_3: {id: '3', show: false, value: 0, name: 'Incorrect Team Score (Loss)'},
      },
			value: 0
		}; //	RULE_3: {id: 'c', show: false, value: 0, name: 'Correct Outcome, Incorrect Score, And'},
		defaultGoalDiff: any;
		totalPoints: number = 0;
		totalGoalDiff: number = 0;

		activate() {
			this.defaultPoints = angular.copy(this.points);
			this.defaultGoalDiff = angular.copy(this.goalDiff);
			this.goalsChanged();
		}

		jokerChanged() {
			this.totalPoints = 0;
			this.totalGoalDiff = 0;
			this.totalPoints += this.points.value;
			this.totalGoalDiff += this.goalDiff.value;
			if(this.hasJoker && this.goalDiff.value >= 0) {
				this.totalPoints += this.points.value;
				this.totalGoalDiff += this.goalDiff.value;
			}
		}

		goalsChanged() {
			this.totalPoints = 0;
			this.totalGoalDiff = 0;
			this.points = angular.copy(this.defaultPoints);
			this.goalDiff = angular.copy(this.defaultGoalDiff);
			let predictionOutcome = 
				this.calcOutcome(this.homeScorePrediction, this.awayScorePrediction);
			let resultOutcome = 
				this.calcOutcome(this.homeScoreResult, this.awayScoreResult);
			let predictionGd = this.homeScorePrediction - this.awayScorePrediction;
			let resultGd = this.homeScoreResult - this.awayScoreResult;

			this.processPoints(predictionOutcome, resultOutcome, predictionGd, resultGd);
			this.processGoalDiff(predictionOutcome, resultOutcome, predictionGd, resultGd);

			this.jokerChanged();
		}

		processPoints(predictionOutcome: string, resultOutcome: string, 
			predictionGd: number, resultGd: number) {
			let rules = this.points.rules;

			if(predictionOutcome === resultOutcome) {
				rules.RULE_1.show = true;
				rules.RULE_1.value = 4;    	
			}

			if(predictionGd === resultGd) {
				rules.RULE_2.show = true;
				rules.RULE_2.value = 1;			
			}

			if(this.homeScorePrediction === this.homeScoreResult) {
      	rules.RULE_3.show = true;
				rules.RULE_3.value += 1;
   	 }

    	if(this.awayScorePrediction === this.awayScoreResult) {
				rules.RULE_3.show = true;
				rules.RULE_3.value += 1;    
			}

			if(this.homeScorePrediction === this.homeScoreResult && 
				this.awayScorePrediction === this.awayScoreResult) {
				rules.RULE_4.show = true;
				rules.RULE_4.value = 1;    
			} 

			if(this.homeScorePrediction > 1 && this.homeScoreResult > 1) {
				rules.RULE_5.show = true;
				rules.RULE_5.value += 1;  
			}

			if(this.awayScorePrediction > 1 && this.awayScoreResult > 1) {
				rules.RULE_5.show = true;
				rules.RULE_5.value += 1; 
			}

			if(Math.abs(predictionGd - resultGd) === 1 && 
				(this.homeScorePrediction === this.homeScoreResult || 
					this.awayScorePrediction === this.awayScoreResult)) {
				rules.RULE_6.show = true;
				rules.RULE_6.value += 1; 
			}

			for(let key in rules) {
				let rule = rules[key];
				if(rule.show) {
					this.points.value += rule.value;
				}
			}
		}

		processGoalDiff(predictionOutcome: string, resultOutcome: string, 
			predictionGd: number, resultGd: number) {
        predictionGd = Math.abs(predictionGd);
        resultGd = Math.abs(resultGd);
        let homeGoalsGd = Math.abs(this.homeScorePrediction - this.homeScoreResult);
        let awayGoalsGd = Math.abs(this.awayScorePrediction - this.awayScoreResult);
        let rules = this.goalDiff.rules;
        rules.RULE_1.show = true;
        if(homeGoalsGd === 0) {
          rules.RULE_2.show = true;
          rules.RULE_2.value += this.homeScoreResult || 1;
        } else {
          rules.RULE_3.show = true;
          rules.RULE_3.value -= homeGoalsGd;
        }
  
        if(awayGoalsGd === 0) {
          rules.RULE_2.show = true;
          rules.RULE_2.value += this.awayScoreResult || 1;
        } else {
          rules.RULE_3.show = true;
          rules.RULE_3.value -= awayGoalsGd;
        }
  
        for(let key in rules) {
            let rule = rules[key];
            this.goalDiff.value += rule.value;
        }
		}

		private calcOutcome(home: number, away: number): string {
			if(home > away){
				return 'w';
			}
			if(home < away){
				return 'l';
			}
			if(home === away){
				return 'd';
			}
		}
	}

	angular
    .module('app.rules')
    .controller('RulesController', RulesController);
}
