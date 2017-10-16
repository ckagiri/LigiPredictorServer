namespace app.core {
  'use strict';

	export interface ICacheService {
		clear: (key: string) => void;
		put: (key: string, value: any) => void;
		get: (key: string) => any;
    info: () => void;
	}

  export class CacheService implements ICacheService {
    static $inject: string[] = ['$cacheFactory'];
    private expires: any = undefined; //config.storeExpirationMs
    private store: any = null;

    constructor(private $cacheFactory: ng.ICacheFactoryService) {
      this.store = this.$cacheFactory('store');
    }

    clear(key: string) {
      return this.store.put(key, null);
    }
    
    get(key: string) {
      return this.store.get(key);
    }

    put(key: string, value: any) {
      return this.store.put(key, value);
    }
    
    info() {
      return this.store.info();
    }
  }

  angular
    .module('app.core')
    .service('cache', CacheService);
}