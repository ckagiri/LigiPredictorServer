namespace applayout {
  'use strict';

  interface ILpTopNavScope {
    navline: string
  }

  class LpTopNav implements ng.IDirective {
    static $inject: Array<string> = [''];
    constructor() { }

    static instance(): ng.IDirective {
      return new LpTopNav();
    }

    bindToController: boolean = true;
    controller: TopNavController = TopNavController;
    controllerAs: string = 'vm';
    link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
    restrict: string = 'EA';
    scope: ILpTopNavScope = {
      'navline': '='
    };
    templateUrl: string = 'app/layout/lp-top-nav.html';
  }

  class TopNavController {
    constructor() { }
  }

  angular
    .module('app.layout')
    .directive('lpTopNav', LpTopNav.instance);
}
