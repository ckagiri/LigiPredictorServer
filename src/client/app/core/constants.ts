/* global toastr:false, moment:false */

namespace app.core {
  'use strict';

  angular
    .module('app.core')
    .constant('toastr', toastr)
    .constant('moment', moment);

  angular.module('app.core')
    .factory('_', ['$window', function($window: ng.IWindowService) { 
      return $window._;
    }]);
}
