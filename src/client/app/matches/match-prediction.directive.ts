namespace app.matches {
	'use strict';

  angular.module('app.matches').directive('matchPrediction', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'app/matches/match-prediction.html'
      };
    }
  ]) 
}