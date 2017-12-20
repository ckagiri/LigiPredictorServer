namespace app.core {
  'use strict';

  export interface ILeaderboardService {
    getCurrentDefaults: () => ng.IPromise<any>;
    getSeasonLeaderboard: (leagueSlug: any, seasonSlug: any) => ng.IPromise<any>;
    getSeasonRoundLeaderboard: (leagueSlug: any, seasonSlug: any, round: number) => ng.IPromise<any>;
    getSeasonMonthLeaderboard: (leagueSlug: any, seasonSlug: any, year: number, month: number) => ng.IPromise<any>;
  }

  export class LeaderboardService implements ILeaderboardService {
    static $inject: Array<string> = ['$http', '$q', 'exception', 'logger'];
    constructor(private $http: ng.IHttpService,
      private $q: ng.IQService,
      private exception: blocks.exception.IException,
      private logger: blocks.logger.Logger) {
    }

    getCurrentDefaults() {
      return this.$http.get('/api/matches/current-defaults')
      .then(this.success)
      .catch(this.fail);
    }

    getSeasonLeaderboard(leagueSlug: any, seasonSlug: any) { 
      return this.$http.get(`/api/leaderboard/league/${leagueSlug}/season/${seasonSlug}`)
        .then(this.success)
        .catch(this.fail);
    }

    getSeasonRoundLeaderboard(leagueSlug: any, seasonSlug: any, round: number) {
      return this.$http.get(`/api/leaderboard/league/${leagueSlug}/season/${seasonSlug}/round/${round}`)
        .then(this.success)
        .catch(this.fail);
      }

    getSeasonMonthLeaderboard(leagueSlug: any, seasonSlug: any, year: number, month: number) {
      return this.$http.get(`/api/leaderboard/league/${leagueSlug}/season/${seasonSlug}/year/${year}/month/${month}`)
        .then(this.success)
        .catch(this.fail);
    }

    private success: (response: any) => {} = (response) => response.data;

    private fail: (error: any) => {} = (error) => {
      var msg = error.data.description;
      var reason = 'query for leaderboard failed.';
      this.exception.catcher(msg)(reason);
      return this.$q.reject(msg);
    }
  }

  angular
    .module('app.core')
    .service('leaderboardService', LeaderboardService);
}