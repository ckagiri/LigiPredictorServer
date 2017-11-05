var app;
(function (app) {
    var whatif;
    (function (whatif) {
        'use strict';
        var WhatIfController = /** @class */ (function () {
            function WhatIfController($q, logger) {
                this.$q = $q;
                this.logger = logger;
                this.title = 'WhatIf';
            }
            WhatIfController.$inject = ['$q', 'logger'];
            return WhatIfController;
        }());
        whatif.WhatIfController = WhatIfController;
        angular
            .module('app.whatif')
            .controller('WhatIfController', WhatIfController);
    })(whatif = app.whatif || (app.whatif = {}));
})(app || (app = {}));
//# sourceMappingURL=whatif.controller.js.map