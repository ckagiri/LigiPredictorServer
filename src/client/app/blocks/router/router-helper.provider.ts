namespace blocks.router {
	'use strict';

	export interface IStateCounts {
		errors: number;
		changes: number;
	}

	export interface IStateConfig {
		state: string;
		config: ng.ui.IState;
	}

	export interface IRouterHelper {
		configureStates(states: Array<IStateConfig>): void;
		configureStates(states: Array<IStateConfig>, otherwiseState: string): void;
		getStates(): ng.ui.IState[];
		stateCounts: IStateCounts;
	}

	export interface IRouterHelperProviderConfig {
		docTitle: string;
		resolveAlways: any;
	}

	export class RouterHelperProvider implements ng.IServiceProvider {
		private config: IRouterHelperProviderConfig;
		static $inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];

		constructor(
			private $locationProvider: ng.ILocationProvider,
			private $stateProvider: ng.ui.IStateProvider,
			private $urlRouterProvider: ng.ui.IUrlRouterProvider) {

			this.config = {
					docTitle: '',
					resolveAlways: {}
			}
			
			this.$get.$inject = ['$location', '$rootScope', '$state', 'logger'];
		}

		public configure(cfg: any) {
			ng.extend(this.config, cfg);
		}

		public $get(
			$location: ng.ILocationService,
			$rootScope: ng.IRootScopeService,
			$state: ng.ui.IStateService,
			logger: blocks.logger.ILogger): IRouterHelper {
			var $stateProvider = this.$stateProvider;
			var $locationProvider = this.$locationProvider;
			var $urlRouterProvider = this.$urlRouterProvider;
			var config = this.config;

			var handlingStateChangeError = false;
			var hasOtherwise = false;

			var stateCounts = {
					errors: 0,
					changes: 0
			}

			var service = {
					configureStates: configureStates,
					getStates: getStates,
					stateCounts: stateCounts
			}

			init();

			return service;

			function init(): void {
				handleAppwideRouting();
				handleRoutingErrors();
				handleStateChanges();
				updateDocTitle();
			}

			function configureStates(states: Array<IStateConfig>): void {
				// Remap root calls, i.e. http://example.org/ --> http://example.org/#/
				//$urlRouterProvider.when('', '/');

				states.forEach(function(state) {
					state.config.resolve =
					ng.extend(state.config.resolve || {}, config.resolveAlways);
					$stateProvider.state(state.state, state.config);
				});
			}

			function handleAppwideRouting(): void {
				$locationProvider.html5Mode(true);
				var otherwise = '/404';
				$urlRouterProvider.otherwise(otherwise);

				homeRoute.$inject = ['$state'];
				function homeRoute($state: ng.ui.IStateService) {
					$state.go('app.home');
				}

				notFoundRoute.$inject = ['$state'];
				function notFoundRoute($state: ng.ui.IStateService) {
					$state.go('app.404');
				}

				$urlRouterProvider.when('', homeRoute);		
				$urlRouterProvider.when('/', homeRoute);
				$urlRouterProvider.when('/404', notFoundRoute);
			}

			function handleRoutingErrors(): void {
				// Route cancellation:
				// On routing error, go to the dashboard.
				// Provide an exit clause if it tries to do it twice.
				$rootScope.$on('$stateChangeError',
					function(event, toState, toParams, fromState, fromParams, error) {
						if (handlingStateChangeError) {
							return;
						}
						stateCounts.errors++;
						handlingStateChangeError = true;
						var destination = (toState &&
							(toState.title || toState.name || toState.loadedTemplateUrl)) ||
							'unknown target';
						var msg = 'Error routing to ' + destination + '. ' +
							(error.data || '') + '. <br/>' + (error.statusText || '') +
							': ' + (error.status || '');
						logger.warning(msg, [toState], '');
						$location.path('/');
					}
				);
			}

			function handleStateChanges(): void {
				$rootScope.$on('$stateChangeSuccess',
					function(event, toState, toParams, fromState, fromParams, error) {
						stateCounts.changes++;
						handlingStateChangeError = false;
						//var title = config.docTitle + ' ' + (toState.title || '');
						var title = (toState.title || '');
						this.$rootScope.title = title; // data bind to <title>
					}
				);
			}

			function getStates(): ng.ui.IState[] {
					return $state.get();
			}

			function updateDocTitle(): void {
				$rootScope.$on('$stateChangeSuccess',
					function(event, toState, toParams, fromState, fromParams) {
						stateCounts.changes++;
						handlingStateChangeError = false;
						var title = config.docTitle + ' ' + (toState.title || '');
						(<any>$rootScope).title = title; // data bind to <title>
					}
				);
			}
		}
	}

	angular
		.module('blocks.router')
		.provider('RouterHelper', RouterHelperProvider);
}