namespace app.directives {
  'use strict';

	interface IScope {
    otherModelValue: string;
  }
	class LpPasswordMatch {
		static $inject: string[] = [''];
    constructor() { }
		static instance(): ng.IDirective {
      return new LpPasswordMatch();
    }
		require:string = 'ngModel';
		scope:IScope = {
			otherModelValue: '=lpPasswordMatch'
		};

		link(scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, ngModel: ng.INgModelController)  {
			ngModel.$validators.compareTo = function(modelValue: any) {
				return modelValue === scope.otherModelValue;
			};
			scope.$watch('otherModelValue', function() {
				ngModel.$validate();
			});
		}
	}
	angular
    .module('app.directives')
    .directive('lpPasswordMatch', LpPasswordMatch.instance);
}
