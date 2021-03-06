namespace app.matches {
	'use strict';

	export class MatchesController {
		static $inject: string[] = ['$q', '$state', '$stateParams', '$scope', '$window', 'matches', 'season', 'logger', 
			'predictionService', 'vosePredictorFactory', 'cache', 'util'];

		constructor(private $q: ng.IQService,
			private $state: ng.ui.IStateService,
			private $stateParams: ng.ui.IStateParamsService,
			private $scope: ng.IScope,
      private $window: ng.IWindowService,
			private fixtures: any[],
			private season: any,
      private logger: blocks.logger.Logger,
			private predictionService: app.core.IPredictionService,
			private vosePredictorFactory: app.matches.VosePredictorFactory,
			private cache: app.core.ICacheService,
      private util: any) {
				this.currentRound = this.season.currentRound;
			  this.leagueSlug = this.$stateParams.league || this.season.league.slug;
				this.seasonSlug = this.$stateParams.season || this.season.slug;
				let matchday = parseInt(this.$stateParams.round || this.currentRound)
				this.matchday = matchday;
				this.restoreState();
				this.refresh();
        this.live();
        this.onDestroy();
    }

		title: string = 'Matches';
		predictions: any = {};
		error: any;
		leagueSlug: string;
		seasonSlug: string;
		matchday: number;
		currentRound: number;
		submitButtonEnabled = false;
		stateKey: string = 'public.matches';
    jokerChosen: string = "";
		totalPoints: number = 0;
		totalGoalDiff: number = 0;
		updateTimeout: any = null;

		private refresh() {
			let hasOneAvailableFixture:boolean = false;
      this.totalPoints = 0;
      this.totalGoalDiff = 0;
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
					} else {
						match.choice = choice;
					}
				} else {
					match.choice = choice;
					if(match.prediction.hasJoker) {
						this.jokerChosen = "chosen";
					}
        }
        match.prediction.points = match.prediction.copyPoints || match.prediction.points;
        match.prediction.goalDiff = match.prediction.copyGoalDiff || match.prediction.goalDiff;
        this.totalPoints += match.prediction.points || 0;
        this.totalGoalDiff += match.prediction.goalDiff || 0;
				if(match.prediction.hasJoker && match.prediction.goalDiff >= 0 && match.prediction.points > 0) {
					this.totalPoints += match.prediction.points;
					this.totalGoalDiff += match.prediction.goalDiff;
          match.prediction.copyPoints = match.prediction.points;
          match.prediction.copyGoalDiff = match.prediction.goalDiff;
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
		}

		score = (match: any, side: string, change: number) => {
			let matchId = match._id
			if(this.predictions[matchId] == null) {
				this.predictions[matchId] =  {
					_id: match.prediction._id,
					goalsHomeTeam: match.choice.goalsHomeTeam,
					goalsAwayTeam: match.choice.goalsAwayTeam
				};	
			}
			let goals = match.choice['goals'+side+'Team'];
      if(this.util.isNumber(goals)) {
        goals = parseInt(goals);
      }
      if(change != null) {
			  if (!(goals == null) && !(goals === 0 && change === -1)){
				  goals += change;
			  } else {
          goals = 0;
        }
      }
			this.predictions[matchId]['goals'+side+'Team'] = goals;
			match.choice['goals'+side+'Team'] = goals;
		}

    homeScoreChanged = (match: any) => {
      let goalsHomeTeam = match.choice.goalsHomeTeam;
      if(this.util.isNumber(goalsHomeTeam)) {
        goalsHomeTeam = parseInt(goalsHomeTeam);
      } else {
        goalsHomeTeam = null;
      }
      match.choice.goalsHomeTeam = goalsHomeTeam;
      this.score(match, 'Home', null);
    }

    awayScoreChanged = (match: any) => {
      let goalsAwayTeam = match.choice.goalsAwayTeam;
      if(this.util.isNumber(goalsAwayTeam)) {
        goalsAwayTeam = parseInt(goalsAwayTeam);
      } else {
        goalsAwayTeam = null;
      }
      match.choice.goalsAwayTeam = goalsAwayTeam;
      this.score(match, 'Away', null);
    }

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
			let hasVose = Object.keys(this.fixtures).some((key: any) => {
				return this.fixtures[key].vosePredictor != null;
			});
			return hasVose;
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
   
    live() {
      let league = this.leagueSlug;
      let season = this.seasonSlug;
      let round = this.matchday;
      if(this.updateTimeout == null) {
        this.scheduleNextUpdate();
      } else {
        this.predictionService.fetchLiveFixtures(league, season, round)
          .then((response: any) => {
            this.updateFixtures(response.data);
            if(this.hasPendingPredictions()) {
              this.predictionService.fetchProcessedPredictions(league, season, round)
                .then((response: any) => {
                  this.updatePredictions(response.data);
                  this.refresh();
                  return this.scheduleNextUpdate();
                })
            } else {
              return this.scheduleNextUpdate();
            }
          })
      }
    } 

    hasLiveFixtures() {
      return this.$window._.some(this.fixtures, (f: any) => f.status === 'IN_PLAY');
    }

    hasPendingPredictions() {
      return this.$window._.some(this.fixtures, 
        (f: any) => f.status === 'FINISHED' && 
        (f.prediction.status == undefined || f.prediction.status === 'PENDING'));
    }

    updateFixtures(fixtures: any[]) {
      	for(let fixture of fixtures) {
          for(let match of this.fixtures) {
            if(fixture._id == match._id) {
              angular.extend(match, fixture);
              break;
            }
          }
        }
    }

    updatePredictions(predictions: any[]) {
      for(let prediction of predictions) {
          for(let match of this.fixtures) {
            if(prediction._id == match.prediction._id) {
              angular.extend(match.prediction, prediction)
              break;
            }
          }
        }
    }
    
    scheduleNextUpdate() {
      clearTimeout(this.updateTimeout);
      let date = this.calculateNextUpdate();
      let now = this.$window.moment();
      let ms = date - now;
	    this.updateTimeout = setTimeout(() => this.live(), ms);
      console.log("Live Update scheduled for " + date.format() + " - that's in " + msToTime(ms));
    }

    calculateNextUpdate() {
      let fixtureLive = false;
      let hasPendingPrediction = false;
      let Moment = this.$window.moment;
      let now = Moment();
      let next = Moment().add(1, 'year');
      for(let fixture of this.fixtures) {
        if(fixture.status === 'FINISHED' && fixture.prediction.status === 'PENDING') {
          hasPendingPrediction = true;
        } else if (fixture.status === "IN_PLAY") {
          fixtureLive = true;
        } else if (fixture.status === "SCHEDULED" || fixture.status === "TIMED") {
          // Parse fixture start date/time
          let fixtureStart = Moment(fixture.date).subtract(5, 'minutes');
          if (fixtureStart > now && fixtureStart < next) {
            next = fixtureStart;
          }
          const diff = fixtureStart.diff(now, 'minutes');
          if(diff <= 10) {
            fixtureLive = true;
          }
        }
      }
      let tomorrow = Moment().add(1, 'day');
      let update = next;
      if (fixtureLive || hasPendingPrediction) {
        update = Moment().add(4, 'minutes');
      } else if (next > tomorrow) {
        update = Moment().add(12, 'hours');
      }
      return update;
    }
  }

  function msToTime(ms: number) {
    let seconds: any = (ms / 1000).toFixed(0);
    let minutes: any = Math.floor(seconds / 60);
    let hours: any = "";
    if (minutes > 59) {
      hours = Math.floor(minutes / 60);
      hours = (hours >= 10) ? hours : "0" + hours;
      minutes = minutes - (hours * 60);
      minutes = (minutes >= 10) ? minutes : "0" + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    if (hours != "") {
      return hours + ":" + minutes + ":" + seconds;
    }
    return minutes + ":" + seconds;
  }

	angular
    .module('app.matches')
    .controller('MatchesController', MatchesController);
}