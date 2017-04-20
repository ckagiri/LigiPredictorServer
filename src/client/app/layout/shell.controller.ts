namespace app.layout {
  'use strict';

  export class ShellController {
    static $inject: Array<string> = ['$rootScope', '$timeout', 'config', 'logger'];
    constructor(private $rootScope: any,
      private $timeout: ng.ITimeoutService,
      private config: { appTitle: string },
      private logger: blocks.logger.Logger) {
      this.logger.success(config.appTitle + ' loaded!', null);
    }
  }

  angular
    .module('app.layout')
    .controller('ShellController', ShellController);
}
