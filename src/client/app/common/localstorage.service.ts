namespace app.core {
  'use strict';

	export interface ILocalStorageService {
		getItem: (key: string) => any;
		setItem: (key: string, value: any) => boolean;
		removeItem: (key: string) => boolean;
	}

	export class LocalStorageService {
		static $inject: Array<string> = ['$window'];
		private localStorage: Storage;

		constructor($window: ng.IWindowService) {
			this.localStorage = $window.localStorage;
		}

		getItem(key: string): any { return JSON.parse(this.localStorage.getItem(key)); }

		setItem(key: string, value: any): boolean {
			this.localStorage.setItem(key, JSON.stringify(value));
			return true;
		}

		removeItem(key: string): boolean {
			this.localStorage.removeItem(key);
			return true;
		}
	}

	angular
    .module('app.core')
    .service('localstorage', LocalStorageService);
}