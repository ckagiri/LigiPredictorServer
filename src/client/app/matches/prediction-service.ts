namespace app.core {
  'use strict';

  export interface IPredictionService {
    pickJoker: (fixture: any) => ng.IPromise<any>;
    submitPredictions: (req:any) => ng.IPromise<any>;
    fetchLiveFixtures: (league: any, season:any, round: any) => ng.IHttpPromise<any>;
    fetchProcessedPredictions: (league: any, season: any, round: any) => ng.IHttpPromise<any>;
  }

  export class PredictionService implements IPredictionService {
    static $inject: [string] = ['$http', '$q', 'exception', 'logger'];
    constructor(private $http: ng.IHttpService,
      private $q: ng.IQService,
      private exception: blocks.exception.IException,
      private logger: blocks.logger.Logger) {
    }

    submitPredictions: (req: any) => ng.IPromise<any> = (req) => {
      return this.$http.post('/api/predictions', req)
        .then(this.success)
        .catch(this.fail)
    }

    pickJoker: (fixture: any) => ng.IPromise<any> = (fixture) => {
      return this.$http.post('/api/predictions/pick-joker', fixture)
        .then(this.success)
        .catch(this.fail);
    }

    fetchLiveFixtures(league: any, season:any, round: any) {
      return this.$http.get('/api/matches/live', {params: {league, season, round}});
    }

    fetchProcessedPredictions(league: any, season: any, round: any) {
      return this.$http.get('/api/predictions/mine', {params: {league, season, round}});
    }

    private success: (response: any) => {} = (response) => response.data;

    private fail: (error: any) => {} = (error) => {
      var msg = (error.data && error.data.description) || 'Something bad happened' ;
      var reason = 'request failed.';
      this.exception.catcher(msg)(reason);
      return this.$q.reject(msg);
    }
  }

  angular
    .module('app.core')
    .service('predictionService', PredictionService);
}
