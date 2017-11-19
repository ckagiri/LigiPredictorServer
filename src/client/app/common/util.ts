(function() {
    'use strict';

    angular.module('app.core').factory('util', factory);

    factory.$inject = ['$q', '$rootScope', '$timeout', 'logger'];

    function factory($q: ng.IQService, $rootScope: ng.IRootScopeService, 
      $timeout: ng.ITimeoutService, logger: ng.ILogService) {
        var service = {
            $broadcast: $broadcast,
            $q: $q,
            $timeout: $timeout,
            logger: logger, // for accessibility

            textContains: textContains,
            isNumber: isNumber
        };

        return service;

        function $broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }

        function textContains(text: string, searchText: string) {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        }

        function isNumber(val: any) {
            // negative or positive
            return /^[-]?\d+$/.test(val);
        }
    }
})();