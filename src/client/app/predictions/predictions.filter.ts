'use strict';

angular.module('predictions').filter('countScore', [
	function() {
		return function(input,number) {
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

angular.module('predictions').filter('calcScore', [
	function() {
		return function(input) {
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