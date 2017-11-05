namespace app.matches {
	'use strict';

	export class MatchesController {
		static $inject: string[] = ['$q', '$state', '$stateParams', '$scope', 'matches', 'season', 'logger', 
			'predictionService', 'vosePredictorFactory', 'cache'];

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
		totalPoints: number = 0;
		totalGoalDiff: number = 0;
		
		private refresh() {
			let hasOneAvailableFixture:boolean = false;
			for(let match of this.fixtures) {
				let choice = match.prediction.choice || {}
				if(match.status == 'SCHEDULED' || match.status == 'TIMED') {
					hasOneAvailableFixture = true;
					if(choice.isComputerGenerated || choice.isComputerGenerated == null) {
						match['vosePredictor'] = this.vosePredictorFactory.createPredictor(match.odds)
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
					if(match.prediction.hasJoker) {
						this.jokerChosen = "chosen";
					}
				}
				this.totalPoints += match.prediction.points || 0;
				this.totalGoalDiff += match.prediction.goalDiff || 0;
				if(match.prediction.hasJoker && match.prediction.goalDiff >= 0 && match.prediction.points > 0) {
					this.totalPoints += match.prediction.points;
					this.totalGoalDiff += match.prediction.goalDiff;
					match.prediction.points *= 2;
					match.prediction.goalDiff *= 2;
				}
			}
			if(!hasOneAvailableFixture) {
				this.jokerChosen = "chosen";
			}
		}

		makePredictions = () => {
 			if(Object.keys(this.predictions).length == 0) return;
			let request = {
				predictions: this.predictions
			}
 			this.predictionService.submitPredictions(request)
				.then((predictions: any) => {
					for(let p of predictions) {
						for(let f of this.fixtures){
							if(p.fixture == f._id) {
								delete f['vosePredictor'];
								delete f['predict'];
							}
						}
					}
					this.logger.success('Successfully Saved!');
				}, (errorResponse: any) => {
						console.log(errorResponse)
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

		pointsClass(fixture: any) {
			if(fixture.status === 'IN_PLAY') {
				return 'label-warning';
			}
			let points = fixture.prediction.points;
			if(points > 0) {
				return 'label-success';
			}
			return 'label-default';
		}

		diffClass(fixture: any) {
			if(fixture.status === 'IN_PLAY') {
				return 'label-warning';
			}
			let diff = fixture.prediction.goalDiff;
			if(diff > 0) {
				return 'label-success';
			} 
			if(diff < 0) {
				return 'label-danger';
			}
			return 'label-default';
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
				if(match.vosePredictor != null) {
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
				fixture.prediction.hasJoker = false;
				console.log('bad')
			})
		}
	}

	angular
    .module('app.matches')
    .controller('MatchesController', MatchesController);
}