var app;
(function (app) {
    var whatif;
    (function (whatif) {
        'use strict';
        var WhatIfController = (function () {
            function WhatIfController($q, logger) {
                this.$q = $q;
                this.logger = logger;
                this.title = 'WhatIf';
            }
            return WhatIfController;
        }());
        WhatIfController.$inject = ['$q', 'logger'];
        whatif.WhatIfController = WhatIfController;
        angular
            .module('app.whatif')
            .controller('WhatIfController', WhatIfController);
    })(whatif = app.whatif || (app.whatif = {}));
})(app || (app = {}));
//# sourceMappingURL=whatif.controller.js.map