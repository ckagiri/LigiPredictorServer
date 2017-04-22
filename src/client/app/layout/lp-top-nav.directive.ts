namespace applayout {
  'use strict';

  interface ILpTopNavScope {
    navline: string
  }


  class LpTopNav implements ng.IDirective {
		static $inject: string[] = ['security'];
    constructor(private security) { }
    static instance(): ng.IDirective {
      return new LpTopNav();
    }
    bindToController = true;
    controller = TopNavController;
    controllerAs = 'vm';
    restrict = 'EA';
    scope: ILpTopNavScope = {
      'navline': '='
    };
    templateUrl: string = 'app/layout/lp-top-nav.html';
		link (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
			scope.$watch(function() {
        return security.currentUser;
      }, function(currentUser) {
      	scope.currentUser = currentUser;
      });
		}
  }

  class TopNavController {
		static $inject: string[] = ['$auth', '$state', 'logger'];
		constructor(private $auth: satellizer.IAuthService,
			private $state: ng.ui.IStateService,
			private logger: blocks.logger.Logger) {
		}			

		isAuthenticated() {
			return this.$auth.isAuthenticated();
		}

		logout() {
			if (!this.$auth.isAuthenticated()) { return; }
			this.$auth.logout()
      .then(() => {
        this.logger.info('You have been logged out');
        this.$state.go('xapp.login');
      });
		}
  }

  angular
    .module('app.layout')
    .directive('lpTopNav', LpTopNav.instance);
}
