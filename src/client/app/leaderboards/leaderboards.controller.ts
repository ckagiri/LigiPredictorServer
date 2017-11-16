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
			private leaderboarService: app.core.ILeaderboardService,) {
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
      this.leaderboarService.getSeasonLeaderboard(this.leagueSlug, this.seasonSlug)
      	.then((data) => {
					this.seasonLeaderboard = data;
				})

      this.leaderboarService.getSeasonRoundLeaderboard(this.leagueSlug, this.seasonSlug, this.round)
      	.then((data) => {
					this.seasonRoundLeaderboard = data;
				})

      this.leaderboarService.getSeasonLeaderboard(this.leagueSlug, this.seasonSlug)
      	.then((data) => {
					this.seasonMonthLeaderboard = data;
				})
    }		
	}

	angular
    .module('app.leaderboards')
    .controller('LeaderboardsController', LeaderboardsController);
}