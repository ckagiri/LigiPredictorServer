var blocks;
(function (blocks) {
    var router;
    (function (router) {
        'use strict';
        var RouterHelperProvider = /** @class */ (function () {
            function RouterHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
                this.$locationProvider = $locationProvider;
                this.$stateProvider = $stateProvider;
                this.$urlRouterProvider = $urlRouterProvider;
                this.config = {
                    docTitle: '',
                    resolveAlways: {}
                };
                this.$locationProvider.html5Mode(true);
                this.$urlRouterProvider.when('', '/');
                this.$get.$inject = ['$injector', '$location', '$rootScope', '$state', 'logger'];
            }
            RouterHelperProvider.prototype.configure = function (cfg) {
                angular.extend(this.config, cfg);
            };
            RouterHelperProvider.prototype.$get = function ($injector, $location, $rootScope, $state, logger) {
                var $stateProvider = this.$stateProvider;
                var $locationProvider = this.$locationProvider;
                var $urlRouterProvider = this.$urlRouterProvider;
                var config = this.config;
                var handlingStateChangeError = false;
                var hasOtherwise = false;
                var stateCounts = {
                    errors: 0,
                    changes: 0
                };
                var service = {
                    configureStates: configureStates,
                    getStates: getStates,
                    stateCounts: stateCounts
                };
                init();
                return service;
                function init() {
                    configureAppWideRoutes();
                    handleRoutingErrors();
                    handleStateChanges();
                    updateDocTitle();
                }
                function configureStates(states) {
                    states.forEach(function (state) {
                        state.config.resolve =
                            angular.extend(state.config.resolve || {}, config.resolveAlways);
                        $stateProvider.state(state.state, state.config);
                    });
                }
                function configureAppWideRoutes() {
                    var otherwise = '/404';
                    $urlRouterProvider.otherwise(otherwise);
                    homeRoute.$inject = ['$state', '$timeout'];
                    function homeRoute($state, $timeout) {
                        $timeout(function () {
                            $state.go('app.index', null, { reload: true });
                        }, 500);
                    }
                    notFoundRoute.$inject = ['$state'];
                    function notFoundRoute($state) {
                        $state.go('app.404');
                    }
                    $urlRouterProvider.when('/', homeRoute);
                    $urlRouterProvider.when('/404', notFoundRoute);
                }
                function handleRoutingErrors() {
                    // Route cancellation:
                    // On routing error, go to the dashboard.
                    // Provide an exit clause if it tries to do it twice.
                    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
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
                    });
                }
                function handleStateChanges() {
                    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, error) {
                        stateCounts.changes++;
                        handlingStateChangeError = false;
                        //var title = config.docTitle + ' ' + (toState.title || '');
                        var title = (toState.title || '');
                        $rootScope.title = title; // data bind to <title>
                    });
                    $rootScope.$on('$stateChangeSuccess', function () {
                        setTimeout(function () {
                            window.scrollTo(0, 0);
                        }, 50);
                    });
                    $rootScope.$on('$stateChangeSuccess', function () {
                        var breadcrumbs = $injector.get('breadcrumbs');
                        var pathElements = $location.path().split('/'), result = [], i;
                        var breadcrumbPath = function (index) {
                            return '/' + (pathElements.slice(0, index + 1)).join('/');
                        };
                        pathElements.shift();
                        for (i = 0; i < pathElements.length; i++) {
                            result.push({ name: pathElements[i] || 'home', path: breadcrumbPath(i) });
                        }
                        breadcrumbs.setAll(result);
                    });
                }
                function getStates() {
                    return $state.get();
                }
                function updateDocTitle() {
                    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                        stateCounts.changes++;
                        handlingStateChangeError = false;
                        var title = config.docTitle + ' ' + (toState.title || '');
                        $rootScope.title = title; // data bind to <title>
                    });
                }
            };
            RouterHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
            return RouterHelperProvider;
        }());
        router.RouterHelperProvider = RouterHelperProvider;
        angular
            .module('blocks.router')
            .provider('routerHelper', RouterHelperProvider);
    })(router = blocks.router || (blocks.router = {}));
})(blocks || (blocks = {}));
//# sourceMappingURL=router-helper.provider.js.map