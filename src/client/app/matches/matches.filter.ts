namespace app.matches {
	'use strict';

  angular.module('app.matches').filter('countScore', [
    function() {
      return function(input: any, number: any) {
        var count = 0;
        angular.forEach(input,function(fixture){
          if(fixture.hasOwnProperty('prediction')) {
            if(fixture.prediction.hasOwnProperty('score')) {
              if(fixture.prediction.score.score === number) {
                count++;
              }
            }
          }
        });
        return count;
      };
    }
  ]);

  angular.module('app.matches').filter('calcScore', [
    function() {
      return function(input: any) {
        var sum = 0;
        angular.forEach(input,function(fixture){
          if(fixture.hasOwnProperty('prediction')) {
            if(fixture.prediction.hasOwnProperty('score')) {
              sum += fixture.prediction.score.score || 0;
            }
          }
        });
        return sum;
      };
    }
  ]);
}