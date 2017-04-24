namespace app.auth {
	'use strict';

	interface IRetryItem {
		reason: string;
		retry: Function;
		cancel: Function;
	}

  export interface IRetryQueue {
		onItemAddedCallbacks: [any];
 		hasMore: () => void;
		push: (item: IRetryItem) => void;
		pushRetryFn: (reason: string, retryFn: Function) => void;
		retryReason: () => void;
		cancelAll: () => void;
		retryAll: () => void;
		clear: () => void;
	}

	class RetryQueue implements IRetryQueue {
		static $inject: string[] = ['$log', '$q'];
		constructor(private $log: ng.ILogService,
			private $q: ng.IQService) 
		{ }
		private retryQueue: any = [];
		onItemAddedCallbacks: any = [];		
		hasMore() {
			return this.retryQueue.length > 0;
		}
		push(retryItem: IRetryItem) {
			this.retryQueue.push(retryItem);
				// Call all the onItemAdded callbacks
				ng.forEach(this.onItemAddedCallbacks, function(cb) {
					try {
						cb(retryItem);
					} catch(e) {
						this.$log.error('securityRetryQueue.push(retryItem): callback threw an error' + e);
					}
				});
		}
		pushRetryFn(reason: string, retryFn: any) {// The reason parameter is optional
			if (arguments.length === 1) {
				retryFn = reason;
				reason = undefined;
			}

			// The deferred object that will be resolved or rejected by calling retry or cancel
			var deferred = this.$q.defer();
			var retryItem: IRetryItem = {
				reason: reason,
				retry: function() {
					// Wrap the result of the retryFn into a promise if it is not already
					this.$q.when(retryFn()).then(function(value: any) {
						// If it was successful then resolve our deferred
						deferred.resolve(value);
						}, function(value: any) {
							// Othewise reject it
							deferred.reject(value);
						}
					);
				},
				cancel: function() {
					// Give up on retrying and reject our deferred
					deferred.reject();
				}
			}
			this.push(retryItem);
			return deferred.promise;
		}
		retryReason() {
			return this.hasMore() && this.retryQueue[0].reason;
		}
		cancelAll() {
			while (this.hasMore()) {
				this.retryQueue.shift().cancel();
			}
		}
		retryAll() {
			while (this.hasMore()) {
				this.retryQueue.shift().retry();
			}
		}
		clear() {
			this.retryQueue = []
		}
	}

	angular
    .module('app.auth')
    .service('retryQueue', RetryQueue);
}

	