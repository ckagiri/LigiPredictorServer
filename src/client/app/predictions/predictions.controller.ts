'use strict';

// Predictions controller
angular.module('predictions').controller('PredictionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Predictions', 'Fixtures','Matchdays',
	function($scope, $stateParams, $location, Authentication, Predictions, Fixtures, Matchdays) {
		$scope.authentication = Authentication;

		// Remove existing Prediction
		$scope.remove = function(prediction) {
			if ( prediction ) { 
				prediction.$remove();

				for (var i in $scope.predictions) {
					if ($scope.predictions [i] === prediction) {
						$scope.predictions.splice(i, 1);
					}
				}
			} else {
				$scope.prediction.$remove(function() {
					$location.path('predictions');
				});
			}
		};

		$scope.find = function() {
			Matchdays.get({},function(data){
				$scope.matchday = data.closest;
			});
			$scope.fixtures = Predictions.query();
			$scope.predictions = {};
		};

		// Submit the predictions
		$scope.createPredictions = function(){
			var predictions = new Predictions($scope.predictions);
			predictions.$save(function(response){
				//$location.path('/predictions');
				$scope.fixtures = Predictions.query();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.score = function(match,side,change){
			$scope.predictions[match] = $scope.predictions[match] || {};
			var goals = $scope.predictions[match]['goals'+side+'Team'] || 0;
			if (!(goals === 0 && change === -1)){
				goals += change;
			}
			$scope.predictions[match]['goals'+side+'Team'] = goals;

		};

		$scope.clearAll = function(){
			$scope.predictions = {};
		};

		$scope.pointsClass = function(points) {
			if(points === 3) {
				return 'label-success';
			} else if (points === 2) {
				return 'label-warning';
			} else {
				return 'label-danger';
			}
		};

		$scope.nextMatchday = function() {
			$scope.matchday++;
		};

		$scope.prevMatchday = function() {
			$scope.matchday--;
		};
	}
]);