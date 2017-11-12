namespace app.core {
  'use strict';

  export interface IFixturePredictionService {
    getFixturesWithPredictions: () => ng.IPromise<any>;
  }

  export class FixturePredictionService implements IFixturePredictionService {
    static $inject: Array<string> = ['$http', '$q', 'exception', 'logger'];
    constructor(private $http: ng.IHttpService,
      private $q: ng.IQService,
      private exception: blocks.exception.IException,
      private logger: blocks.logger.Logger) {
    }

    getFixturesWithPredictions: () => ng.IPromise<any> = () =>
      this.$http.get('/api/matches/predictions')
        .then(this.success)
        .catch(this.fail);

    private success: (response: any) => {} = (response) => response.data;

    private fail: (error: any) => {} = (error) => {
      var msg = error.data.description;
      var reason = 'query for fixture-with-predictions failed.';
      this.exception.catcher(msg)(reason);
      return this.$q.reject(msg);
    }
  }

  angular
    .module('app.core')
    .service('fixturePredictionService', FixturePredictionService);
}