namespace app.layout {
  'use strict';

  interface ILpTopNavScope {
    navline: string
  }

  class LpTopNav implements ng.IDirective {
		static $inject: string[] = [''];
    constructor() { }
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
		link (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {};
  }

  class TopNavController {
		static $inject: string[] = ['$state', 'logger', 'securityService'];
		constructor(private $state: ng.ui.IStateService,
			private logger: blocks.logger.Logger,
			private security: app.auth.ISecurityService) {
		}		

		isAuthenticated() {
			return this.security.isAuthenticated();
		}

    isAdmin() {
      return this.security.isAdmin();
    }

		logout() {
			if (!this.security.isAuthenticated()) { return; }
			this.security.logout()
				.then(() => {
					this.logger.info('You have been logged out');
				});
		}

    userName() {
      let currentUser = this.security.currentUser || { displayName: 'User'};
      return currentUser.displayName;
    }

		isCurrent(route: { title: string }) {
      var currentState: any = this.$state.current;
      if (!route.title || !currentState || !currentState.title) {
        return '';
      }
      var menuName: string = route.title;
      return currentState.title.substr(0, menuName.length) === menuName ? 'current' : '';
    }

		isNavbarActive(navBarPath: string) {
			return true;
    	//return navBarPath === breadcrumbs.getFirst().name;
  	}
  }

  angular
    .module('app.layout')
    .directive('lpTopNav', LpTopNav.instance);
}
