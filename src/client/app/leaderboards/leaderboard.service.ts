namespace app.core {
  'use strict';

  export interface ILeaderboardService {
  }

  export class LeaderboardService implements ILeaderboardService {
  }

  angular
    .module('app.core')
    .service('leaderboardService', LeaderboardService);
}