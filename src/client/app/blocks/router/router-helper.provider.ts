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
			this.$locationProvider.html5Mode(true);
			this.$urlRouterProvider.when('', '/');
			this.$get.$inject = ['$injector', '$location', '$rootScope', '$state', 'logger'];
		}

		public configure(cfg: any) {
			angular.extend(this.config, cfg);
		}

		public $get(
			$injector: ng.auto.IInjectorService,
			$location: ng.ILocationService,
			$rootScope: ng.IRootScopeService,
			$state: ng.ui.IStateService,
			logger: blocks.logger.ILogger
			): IRouterHelper {
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
				configureAppWideRoutes();
				handleRoutingErrors();
				handleStateChanges();
				updateDocTitle();
			}

			function configureStates(states: Array<IStateConfig>): void {
				states.forEach(function(state) {
					state.config.resolve =
						angular.extend(state.config.resolve || {}, config.resolveAlways);
					$stateProvider.state(state.state, state.config);
				});
			}

			function configureAppWideRoutes(): void {
				var otherwise = '/404';
				$urlRouterProvider.otherwise(otherwise);

				homeRoute.$inject = ['$state', '$timeout'];
				function homeRoute($state: ng.ui.IStateService, $timeout: ng.ITimeoutService) {
					$timeout(function() {  // Necessary to prevent race condition with UI router (site loads in popup)
						$state.go('app.index', null, { reload: true });
					}, 500);
				}

				notFoundRoute.$inject = ['$state'];
				function notFoundRoute($state: ng.ui.IStateService) {
					$state.go('app.404');
				}

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
						$rootScope.title = title; // data bind to <title>
					}
				);

				$rootScope.$on('$stateChangeSuccess', function () {
					setTimeout(function () {
						window.scrollTo(0, 0);
					}, 50);
        });

				$rootScope.$on('$stateChangeSuccess', function() {
					let breadcrumbs: app.core.IBreadcrumbsService = $injector.get('breadcrumbs');
					var pathElements = $location.path().split('/'), result = [], i;
					var breadcrumbPath = function (index: number) {
							return '/' + (pathElements.slice(0, index + 1)).join('/');
					};
					pathElements.shift();
					for (i=0; i<pathElements.length; i++) {
							result.push({name: pathElements[i] || 'home', path: breadcrumbPath(i)});
					}
					breadcrumbs.setAll(result);
				});
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
		.provider('routerHelper', RouterHelperProvider);
}