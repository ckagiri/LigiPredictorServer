namespace app.core {
  'use strict';

	export interface StaticResource {
		all(cb?: any, errorcb?: any): ng.IPromise<any>;
		query(queryJson?: any, successcb?: any, errorcb?: any): ng.IPromise<any>;
		getById(id: number, successcb?: any, errorcb?: any): ng.IPromise<any>;
	}
	export interface InstanceResource {
		id(): number;
		save(successcb?: any, errorcb?: any): ng.IPromise<any>;
		update(successcb?: any, errorcb?: any): ng.IPromise<any>;
		remove(successcb?: any, errorcb?: any): ng.IPromise<any>;
		saveOrUpdate(successcb?: any, errorcb?: any, errorSavecb?: any, errorUpdatecb?: any): ng.IPromise<any>;
	}

	export interface IResource extends StaticResource, InstanceResource {	}

	ResourceFactory.$inject = ['config','$http', '$q']
	function ResourceFactory(config: any, $http: ng.IHttpService, $q: ng.IQService) {
		return function (resourceName: string) {
			var url = config.baseUrl + '/api/' + resourceName;
			var defaultParams = {};

			var Resource: StaticResource;
			Resource = class Resource implements InstanceResource {
				constructor(data: any) {
					angular.extend(this, data);
				}

				_id: number;

				static all(cb: any, errorcb: any) {
					return Resource.query({}, cb, errorcb);
				}

				static query(queryJson: any, successcb: any, errorcb: any) {
					var params = angular.isObject(queryJson) ? {q:JSON.stringify(queryJson)} : {};
					var httpPromise = $http.get(url, {params:angular.extend({}, defaultParams, params)});
					return Resource.thenFactoryMethod(httpPromise, successcb, errorcb, true);
				}

				static getById(id: number, successcb: any, errorcb: any) {
					var httpPromise = $http.get(url + '/' + id, {params:defaultParams});
					return Resource.thenFactoryMethod(httpPromise, successcb, errorcb);
				}

				id() {
					if (this._id) {
						return this._id;
					}
					return 0;
				}

				save(successcb: any, errorcb: any) {
					var httpPromise = $http.post(url, this, {params:defaultParams});
					return Resource.thenFactoryMethod(httpPromise, successcb, errorcb);
				}

				update(successcb: any, errorcb: any) {
					var httpPromise = $http.put(url + "/" + this.id(), angular.extend({}, this, {_id:undefined}), {params:defaultParams});
					return Resource.thenFactoryMethod(httpPromise, successcb, errorcb);
				}

				remove(successcb: any, errorcb: any) {
					var httpPromise = $http['delete'](url + "/" + this.id(), {params:defaultParams});
					return Resource.thenFactoryMethod(httpPromise, successcb, errorcb);
				}

				saveOrUpdate(savecb: any, updatecb: any, errorSavecb: any, errorUpdatecb: any) {
					if (this.id()) {
						return this.update(updatecb, errorUpdatecb);
					} else {
						return this.save(savecb, errorSavecb);
					}
				}

				private static thenFactoryMethod(httpPromise: ng.IHttpPromise<any>, successcb: any, errorcb: any, isArray?: boolean) {
					var scb = successcb || angular.noop;
					var ecb = errorcb || angular.noop;

					return httpPromise.then(function (response: any) {
						var result;
						if (isArray) {
							result = [];
							for (var i = 0; i < response.data.length; i++) {
								result.push(new Resource(response.data[i]));
							}
						} else {
							if (response.data === " null "){
								return $q.reject({
									code:'resource.notfound',
									resource:resourceName
								});
							} else {
								result = new Resource(response.data);
							}
						}
						scb(result, response.status, response.headers, response.config);
						return result;
					}, function (response: any) {
						ecb(undefined, response.status, response.headers, response.config);
						return undefined;
					})
				}
			}
			return Resource;
		}
	}

  angular
    .module('app.core')
    .factory('resource', ResourceFactory);
}