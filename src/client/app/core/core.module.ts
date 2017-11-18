namespace app.core {
  'use strict';

  angular
    .module('app.core', [
      'ngAnimate', 'ngSanitize', 'ui.router', 
      'blocks.exception', 'blocks.logger', 'blocks.router',
      'ngplus', 'ngMessages', 'satellizer', 'nvd3'
    ]);
}
