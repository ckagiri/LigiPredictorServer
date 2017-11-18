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
        this.activate();
    }

		title: string = 'Leaderboards';
    leagueSlug: string;
		seasonSlug: string;
		round: number;
		currentRound: number;
    seasonLeaderboard: any;
    seasonRoundLeaderboard: any;
    seasonMonthLeaderboard: any;

    private activate() {
			let d = new Date();
			let month = d.getUTCMonth() + 1;
			let year = d.getFullYear();

      this.leaderboardService.getSeasonLeaderboard(this.leagueSlug, this.seasonSlug)
      	.then((data) => {
					this.seasonLeaderboard = data;
				})

      this.leaderboardService.getSeasonRoundLeaderboard(this.leagueSlug, this.seasonSlug, this.round)
      	.then((data) => {
					this.seasonRoundLeaderboard = data;
				})

      this.leaderboardService.getSeasonMonthLeaderboard(this.leagueSlug, this.seasonSlug, year, month)
      	.then((data) => {
					this.seasonMonthLeaderboard = data;
				})
    }		
	}

	angular
    .module('app.leaderboards')
    .controller('LeaderboardsController', LeaderboardsController);
}