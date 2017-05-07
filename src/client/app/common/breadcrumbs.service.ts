namespace app.core {
  'use strict';

	export interface IBreadcrumbsService {
		setAll: (items: any[]) => void;
		getAll : () => any[];
		getFirst : () => any;
	}

	export class BreadcrumbsService implements IBreadcrumbsService {
		private breadcrumbs: any[] = [];

		getAll() { 
			return this.breadcrumbs;
		}

		setAll(items: any[]) {
			this.breadcrumbs = items;
		}

		getFirst () {
			return this.breadcrumbs[0] || {};
		}
	}

	angular
    .module('app.core')
    .service('breadcrumbs', BreadcrumbsService);
}