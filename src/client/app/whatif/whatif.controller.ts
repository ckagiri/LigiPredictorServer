namespace app.whatif {
	'use strict';

	export class WhatIfController {
		static $inject: string[] = ['$q', 'logger'];

		constructor(private $q: ng.IQService,
      private logger: blocks.logger.Logger) {
    }

		title: string = 'WhatIf';
	}

	angular
    .module('app.whatif')
    .controller('WhatIfController', WhatIfController);
}