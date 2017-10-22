namespace app.matches {
	'use strict';

	export class MatchesController {
		static $inject: string[] = ['$q', '$state', '$stateParams', '$scope', 'matches', 'season', 'logger', 
			'PredictionsResource', 'vosePredictorFactory', 'cache'];

		constructor(private $q: ng.IQService,
			private $state: ng.ui.IStateService,
			private $stateParams: ng.ui.IStateParamsService,
			private $scope: ng.IScope,
			private fixtures: any[],
			private season: any,
      private logger: blocks.logger.Logger,
			private predictionService: app.core.IPredictionService,
			private vosePredictorFactory: app.matches.VosePredictorFactory,
			private cache: app.core.ICacheService) {
				this.currentRound = this.season.currentRound;
			  this.leagueSlug = this.$stateParams.league || this.season.league.slug;
				this.seasonSlug = this.$stateParams.season || this.season.slug;
				let matchday = parseInt(this.$stateParams.round || this.currentRound)
				this.matchday = matchday;
				this.onDestroy();
				this.restoreState();
				this.refresh()
    }

		title: string = 'Matches';
		predictions: any = {};
		error: any;
		leagueSlug: string;
		seasonSlug: string;
		matchday: number;
		currentRound: number;
		luckySpinEnabled = false;
		submitButtonEnabled = false;
		stateKey: string = 'public.matches';
    jokerChosen: string = "";

		private refresh() {
			for(let match of this.fixtures) {
				let choice = match.prediction.choice || {}
				if(match.status == 'SCHEDULED' || match.status == 'TIMED') {
					if(choice.isComputerGenerated || choice.isComputerGenerated == null) {
						let odds = match.odds;
						if (odds == null) {
							odds = {homeWin: 1, awayWin: 1, draw:1}
						}
						match['vosePredictor'] = this.vosePredictorFactory.createPredictor(odds)
						match['predict'] = () => {
							let predictor = match['vosePredictor']
							let score = predictor.predict();
							let goals = score.split('-');
							let goalsHomeTeam = goals[0];
							let goalsAwayTeam = goals[1];
							match.choice = {
								goalsHomeTeam, goalsAwayTeam
							}
							if(this.predictions[match._id] == null) {
								this.predictions[match._id] =  {
									_id: match.prediction._id
								}	
							}
							this.predictions[match._id]['goalsHomeTeam'] = goalsHomeTeam;
							this.predictions[match._id]['goalsAwayTeam'] = goalsAwayTeam;	
						}
						match.choice = {
							goalsHomeTeam: null,
							goalsAwayTeam: null
						}
						this.luckySpinEnabled = true;
					} else {
						match.choice = choice;
					}
				} else {
					match.choice = choice;
				}
				// if (match.prediction.hasJoker) {
				// 	this.jokerChosen = "chosen";
				// }
			}
		}

		makePredictions = () => {
			let request:any = {};
			request.predictions = this.predictions;
			request.joker = this.predictions
			this.predictionService.submitPredictions(request)
				.then((data: any) => {
					this.logger.success('Successfully Saved!');
				}, (errorResponse: any) => {
					this.error = errorResponse.data.message;
				});
		};

		score = (match: any, side: string, change: number) => {
			var matchId = match._id
			if(this.predictions[matchId] == null) {
				this.predictions[matchId] =  {
					_id: match.prediction._id,
					goalsHomeTeam: match.choice.goalsHomeTeam,
					goalsAwayTeam: match.choice.goalsAwayTeam
				};	
			}
			var goals = match.choice['goals'+side+'Team'] 
			if (!(goals == null) && !(goals === 0 && change === -1)){
				goals += change;
			}
			this.predictions[matchId]['goals'+side+'Team'] = goals || 0;
			match.choice['goals'+side+'Team'] = goals || 0;
		};

		pointsClass(points: any) {
			return 'label-success';
		};

		diffClass(diff: any) {
			if(diff > -1) {
				return 'label-success';
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

		luckySpin() {
			for(let match of this.fixtures) {
				if(match.predict != null) {
					match.predict();
				}
			}
		}

		showLuckySpin() {
			let res = Object.keys(this.predictions).some((key: any) => {
				return this.predictions[key].vosePredictor != null;
			});
			return this.luckySpinEnabled || res;
		}

		showSubmitButton(){
			for(let match of this.fixtures) {
				if(match.status == 'SCHEDULED' || match.status == 'TIMED') {
					this.submitButtonEnabled = true;
					break; 
				}
			}
			return this.submitButtonEnabled;
		}

		gotoMatchday() {
			this.$state.go('app.matches', {
				league: this.leagueSlug, 
				season: this.seasonSlug, 
				round: this.matchday
			});
		}

		restoreState() {
			let cached: any = this.cache.get(this.stateKey);
			if (!cached) { return; }
			this.predictions = cached.predictions;
			console.log(this.predictions);
		}

		onDestroy() {
			this.$scope.$on('$destroy', () => {
				let state = {
					predictions: this.predictions,
					league: this.leagueSlug, 
					season: this.seasonSlug, 
					round: this.matchday
				};
				this.cache.put(this.stateKey, state);
			});
		}

		jokerChange(fixture: any) {
			this.predictionService.pickJoker(fixture).then(data => {
				angular.forEach(this.fixtures, (value, key) => {
					if (fixture != value) {
						value.prediction.hasJoker = false;
					}
				})
			}).catch(() => {
				console.log('bad')
			})
		}
	}

	angular
    .module('app.matches')
    .controller('MatchesController', MatchesController);
}