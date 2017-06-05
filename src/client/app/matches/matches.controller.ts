namespace app.matches {
	'use strict';

	export class MatchesController {
		static $inject: string[] = ['$q', '$state', '$stateParams', 'matches', 'season', 'logger', 'PredictionsResource'];

		constructor(private $q: ng.IQService,
			private $state: ng.ui.IStateService,
			private $stateParams: ng.ui.IStateParamsService,
			private fixtures: any[],
			private season: any,
      private logger: blocks.logger.Logger,
			private Predictions: app.core.IPredictionsResource) {
				this.currentRound = this.season.currentRound;
			  this.leagueSlug = this.$stateParams.league || this.season.league.slug;
				this.seasonSlug = this.$stateParams.season || this.season.slug;
				let matchday = parseInt(this.$stateParams.round || this.currentRound)
				this.matchday = matchday;
				this.init()
    }

		title: string = 'Matches';
		predictions: any = {};
		error: any;
		leagueSlug: string;
		seasonSlug: string;
		matchday: number;
		currentRound: number;

		private init() {
			for(let match of this.fixtures) {
				if(!match.result) {
					let choice = match.prediction.choice || {}
					this.predictions[match._id] = this.predictions[match._id] || {};
					this.predictions[match._id]['_id'] = match.prediction._id;
					if(!choice.isComputerGenerated) {
						this.predictions[match._id]['goalsHomeTeam'] = choice.goalsHomeTeam;
						this.predictions[match._id]['goalsAwayTeam'] = choice.goalsAwayTeam;
					}
				}
			}
		}

		createPredictions = () => {
			var predictions = this.Predictions.newInstance(this.predictions);
			predictions.save((response: any) => {
				this.logger.success('Successfully Saved!');
			}, (errorResponse: any) => {
				this.error = errorResponse.data.message;
			});
		};

		score = (match: any, side: string, change: number) => {
			var goals = this.predictions[match]['goals'+side+'Team'];
			if (!(goals == null) && !(goals === 0 && change === -1)){
				goals += change;
			}
			this.predictions[match]['goals'+side+'Team'] = goals || 0;
		};

		pointsClass(points: any) {
			if(points === 3) {
				return 'label-success';
			} else if (points === 2) {
				return 'label-warning';
			} else {
				return 'label-danger';
			}
		};

		nextMatchday() {
			if(this.matchday < this.season.numberOfRounds) {
				this.matchday += 1;
				this.gotoMatchday();
			}
		}

		prevMatchday() {
			if(this.matchday > 1) {
				this.matchday -= 1;
				this.gotoMatchday();
			}
		}

		currMatchday() {
			this.matchday = this.currentRound;
			this.gotoMatchday();
		}

		private gotoMatchday() {
			this.$state.go('app.matches', {
				league: this.leagueSlug, 
				season: this.seasonSlug, 
				round: this.matchday
			});
		}
	}

	angular
    .module('app.matches')
    .controller('MatchesController', MatchesController);
}