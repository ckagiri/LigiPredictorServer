namespace app.core {
  'use strict';

  export interface IPredictionService {
    pickJoker: (fixture: any) => ng.IPromise<any>;
    submitPredictions: (req:any) => ng.IPromise<any>;
  }

  export class PredictionService implements IPredictionService {
    static $inject: [string] = ['$http', '$q', 'exception', 'logger'];
    constructor(private $http: ng.IHttpService,
      private $q: ng.IQService,
      private exception: blocks.exception.IException,
      private logger: blocks.logger.Logger) {
    }

    submitPredictions: (req: any) => ng.IPromise<number> = (req) => {
      return this.$http.post('/api/predictions', req)
        .then(this.success)
        .catch(this.fail)
    }

    pickJoker: (fixture: any) => ng.IPromise<any> = (fixture) =>
      this.$http.post('/api/predictions/pick-joker', fixture)
        .then(this.success)
        .catch(this.fail);

    private success: (response: any) => {} = (response) => response.data;

    private fail: (error: any) => {} = (error) => {
      var msg = error.data.description;
      var reason = 'query for predictions failed.';
      this.exception.catcher(msg)(reason);
      return this.$q.reject(msg);
    }
  }

  angular
    .module('app.core')
    .service('predictionService', PredictionService);
}
