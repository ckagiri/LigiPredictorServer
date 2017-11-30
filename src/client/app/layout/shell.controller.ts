namespace app.layout {
  'use strict';

  export class ShellController {
    static $inject: Array<string> = ['$rootScope', '$timeout', 'breadcrumbs', 'config', 'logger', 'securityService'];
    constructor(private $rootScope: ng.IRootScopeService,
      private $timeout: ng.ITimeoutService,
			private breadcrumbs: app.core.IBreadcrumbsService,
      private config: { appTitle: string },
      private logger: blocks.logger.Logger,
			private security: app.auth.ISecurityService) {
      this.logger.success(config.appTitle + ' loaded!', null);
    }

    isAdmin() {
      return this.security.isAdmin();
    }
  }

  angular
    .module('app.layout')
    .controller('ShellController', ShellController);
}
