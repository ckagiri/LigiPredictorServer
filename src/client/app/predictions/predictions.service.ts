namespace app.core {
  'use strict';

  export interface IPredictionsService {
  }

  export class PredictionsService implements IPredictionsService {
  }

  angular
    .module('app.core')
    .service('predictionsService', PredictionsService);
}