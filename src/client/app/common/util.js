(function () {
    'use strict';
    angular.module('app.core').factory('util', factory);
    factory.$inject = ['$q', '$rootScope', '$timeout', 'logger'];
    function factory($q, $rootScope, $timeout, logger) {
        var service = {
            $broadcast: $broadcast,
            $q: $q,
            $timeout: $timeout,
            logger: logger,
            textContains: textContains,
            isNumber: isNumber
        };
        return service;
        function $broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }
        function textContains(text, searchText) {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        }
        function isNumber(val) {
            // negative or positive
            return /^[-]?\d+$/.test(val);
        }
    }
})();
//# sourceMappingURL=util.js.map