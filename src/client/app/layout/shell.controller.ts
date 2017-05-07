namespace app.layout {
  'use strict';

  export class ShellController {
    static $inject: Array<string> = ['$rootScope', '$timeout', 'breadcrumbs', 'config', 'logger'];
    constructor(private $rootScope: ng.IRootScopeService,
      private $timeout: ng.ITimeoutService,
			private breadcrumbs: app.core.IBreadcrumbsService,
      private config: { appTitle: string },
      private logger: blocks.logger.Logger) {
      this.logger.success(config.appTitle + ' loaded!', null);
    }
  }

  angular
    .module('app.layout')
    .controller('ShellController', ShellController);
}
