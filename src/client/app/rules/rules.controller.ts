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
				RULE_1: {hasValue: false, value: 0},
				RULE_2: {hasValue: false, value: 0},
				RULE_3: {hasValue: false, value: 0},
				RULE_4: {hasValue: false, value: 0},
				RULE_5: {hasValue: false, value: 0},
				RULE_6: {hasValue: false, value: 0}
			},
			value: 0
		};
		defaultPoints: any;
		goalDiff: any = {
			rules: {
				RULE_1: {hasValue: false, value: 0},
				RULE_2: {hasValue: false, value: 0},
				RULE_3_1: {hasValue: false, value: 0},
				RULE_3_2: {hasValue: false, value: 0},
				RULE_4: {hasValue: false, value: 0}
			},
			value: 0
		};
		defaultGoalDiff: any;
		totalPoints: number = 0;
		totalGoalDiff: number = 0;

		activate() {
			this.defaultPoints = angular.copy(this.points);
			this.defaultGoalDiff = angular.copy(this.goalDiff);
			this.goalsChanged();
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

			this.totalPoints += this.points.value;
			this.totalGoalDiff += this.goalDiff.value;
			if(this.hasJoker && this.goalDiff.value >= 0) {
				this.totalPoints += this.points.value;
				this.totalGoalDiff += this.goalDiff.value;
			}
		}

		processPoints(predictionOutcome: string, resultOutcome: string, 
			predictionGd: number, resultGd: number) {
			let rules = this.points.rules;

			if(predictionOutcome === resultOutcome) {
				rules.RULE_1.hasValue = true;
				rules.RULE_1.value = 4;    	
			}

			if(predictionGd === resultGd) {
				rules.RULE_2.hasValue = true;
				rules.RULE_2.value = 1;			
			}

			if(this.homeScorePrediction === this.homeScoreResult) {
      	rules.RULE_3.hasValue = true;
				rules.RULE_3.value += 1;
   	 }

    	if(this.awayScorePrediction === this.awayScoreResult) {
				rules.RULE_3.hasValue = true;
				rules.RULE_3.value += 1;    
			}

			if(this.homeScorePrediction === this.homeScoreResult && 
				this.awayScorePrediction === this.awayScoreResult) {
				rules.RULE_4.hasValue = true;
				rules.RULE_4.value = 1;    
			} 

			if(this.homeScorePrediction > 1 && this.homeScoreResult > 1) {
				rules.RULE_5.hasValue = true;
				rules.RULE_5.value += 1;  
			}

			if(this.awayScorePrediction > 1 && this.awayScoreResult > 1) {
				rules.RULE_5.hasValue = true;
				rules.RULE_5.value += 1; 
			}

			if(Math.abs(predictionGd - resultGd) === 1 && 
				(this.homeScorePrediction === this.homeScoreResult || 
					this.awayScorePrediction === this.awayScoreResult)) {
				rules.RULE_6.hasValue = true;
				rules.RULE_6.value += 1; 
			}

			for(let key in rules) {
				let rule = rules[key];
				if(rule.hasValue) {
					this.points.value += rule.value;
				}
			}
		}

		processGoalDiff(predictionOutcome: string, resultOutcome: string, 
			predictionGd: number, resultGd: number) {
			predictionGd = Math.abs(predictionGd);
			resultGd = Math.abs(resultGd);
			let homeGoalsGd = null;
			let awayGoalsGd = null;
			let minGd = Math.abs(Math.min(predictionGd, resultGd)) || 1;
			let rules = this.goalDiff.rules;

			rules.RULE_4.hasValue = true;
			rules.RULE_4.value = minGd;

	   	if(predictionOutcome === resultOutcome) {
				homeGoalsGd = Math.abs(this.homeScorePrediction - this.homeScoreResult);
				awayGoalsGd = Math.abs(this.awayScorePrediction - this.awayScoreResult);
				if(homeGoalsGd > 0 && awayGoalsGd > 0 &&  predictionGd === resultGd) {
					rules.RULE_3_2.hasValue = true;
					rules.RULE_3_2.value = 1;
				}    
				if(homeGoalsGd === 1) {
					rules.RULE_2.hasValue = false;
					rules.RULE_2.value -= 1;

					rules.RULE_3_1.hasValue = true;
					rules.RULE_3_1.value += 1;
				} else {
					homeGoalsGd = null;
				}

				if(awayGoalsGd === 1) {
					rules.RULE_2.hasValue = false;
					rules.RULE_2.value -= 1;

					rules.RULE_3_1.hasValue = true;
					rules.RULE_3_1.value += 1;
				} else {
					awayGoalsGd = null;
				}
    	}

			if(homeGoalsGd === null) {
				homeGoalsGd = Math.abs(this.homeScorePrediction - this.homeScoreResult);
				if(homeGoalsGd === 0) {
					rules.RULE_1.hasValue = true;
					rules.RULE_1.value += this.homeScoreResult || 1;
				} else {
					rules.RULE_2.hasValue = true;
					rules.RULE_2.value -= homeGoalsGd;
				}
			}

			if(awayGoalsGd === null) {
				awayGoalsGd = Math.abs(this.awayScorePrediction - this.awayScoreResult);
				if(awayGoalsGd === 0) {
					rules.RULE_1.hasValue = true;
					rules.RULE_1.value += this.awayScoreResult || 1;
				} else {
					rules.RULE_2.hasValue = true;
					rules.RULE_2.value -= awayGoalsGd;
				}
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