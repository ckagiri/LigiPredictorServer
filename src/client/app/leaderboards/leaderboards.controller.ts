namespace app.leaderboards {
	'use strict';

	export class LeaderboardsController {
		static $inject: string[] = ['$q', '$state', '$stateParams', '$scope', 'logger', 'season', 'leaderboardService']

		constructor(private $q: ng.IQService,
			private $state: ng.ui.IStateService,
			private $stateParams: ng.ui.IStateParamsService,
			private $scope: ng.IScope,
      private logger: blocks.logger.Logger,
			private season: any,
			private leaderboardService: app.core.ILeaderboardService,) {
        this.leagueSlug = this.$stateParams.league || this.season.league.slug;
        this.seasonSlug = this.$stateParams.season || this.season.slug;
        this.round = this.$stateParams.round || this.season.currentRound;
        let d = new Date();
        this.month = this.$stateParams.month || d.getUTCMonth() + 1;
        this.year = this.$stateParams.year || d.getFullYear();
        this.activate();
    }

		title: string = 'Leaderboards';
    leagueSlug: string;
		seasonSlug: string;
    round: number;
    month: number;
    year: number;
		currentRound: number;
    seasonLeaderboard: any;
    seasonRoundLeaderboard: any;
    seasonMonthLeaderboard: any;
    rounds: any[];
    months: any[];
    selectedMonth: any;
    selectedRound: any;
    private activate() {
      this.leaderboardService.getCurrentDefaults()
        .then((data) => {
          console.log(data);
          let {round, month, year} = data;
          this.round = round;
          this.month = month;
          this.year = year;
          this.initDropDowns();
          this.getSeasonLeaderboard();
          this.getSeasonRoundLeaderboard();
          this.getSeasonMonthLeaderboard();
        })
    }		

    getSeasonLeaderboard() {
      this.leaderboardService.getSeasonLeaderboard(this.leagueSlug, this.seasonSlug)
      .then((data) => {
        this.seasonLeaderboard = data;
      })
    }

    getSeasonRoundLeaderboard() {
      if(this.selectedRound != null) {
        this.round = this.selectedRound.id
      }
      this.leaderboardService.getSeasonRoundLeaderboard(this.leagueSlug, this.seasonSlug, this.round)
      .then((data) => {
        this.seasonRoundLeaderboard = data;
      })
    }

    getSeasonMonthLeaderboard() {
      if(this.selectedMonth != null) {
        this.month = this.selectedMonth.id
      }
      this.leaderboardService.getSeasonMonthLeaderboard(this.leagueSlug, this.seasonSlug, this.year, this.month)
      .then((data) => {
        this.seasonMonthLeaderboard = data;
      })
    }

    initDropDowns() {
      this.rounds = Array.apply(null, {length: this.round}).map((value:any, index: number) => {
        return {
          id: index + 1,
          name: index + 1
        }
      });
      this.months = Array.apply(null, {length: 12}).map((value:any, index: number) => {
        let names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return {
          id: index + 1,
          name: names[index]
        }
      });
      this.selectedRound = this.rounds.filter(n => { return n.id == this.round })[0];
      this.selectedMonth = this.months.filter(n => { return n.id == this.month })[0];
    }
	}

	angular
    .module('app.leaderboards')
    .controller('LeaderboardsController', LeaderboardsController);
}