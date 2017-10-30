var app;
(function (app) {
    var layout;
    (function (layout) {
        'use strict';
        var LpTopNav = (function () {
            function LpTopNav() {
                this.bindToController = true;
                this.controller = TopNavController;
                this.controllerAs = 'vm';
                this.restrict = 'EA';
                this.scope = {
                    'navline': '='
                };
                this.templateUrl = 'app/layout/lp-top-nav.html';
            }
            LpTopNav.instance = function () {
                return new LpTopNav();
            };
            LpTopNav.prototype.link = function (scope, element, attrs) { };
            ;
            return LpTopNav;
        }());
        LpTopNav.$inject = [''];
        var TopNavController = (function () {
            function TopNavController($state, logger, security) {
                this.$state = $state;
                this.logger = logger;
                this.security = security;
            }
            TopNavController.prototype.isAuthenticated = function () {
                return this.security.isAuthenticated();
            };
            TopNavController.prototype.isAdmin = function () {
                return this.security.isAdmin();
            };
            TopNavController.prototype.logout = function () {
                var _this = this;
                if (!this.security.isAuthenticated()) {
                    return;
                }
                this.security.logout()
                    .then(function () {
                    _this.logger.info('You have been logged out');
                });
            };
            TopNavController.prototype.userName = function () {
                var currentUser = this.security.currentUser || { displayName: 'User' };
                return currentUser.displayName;
            };
            TopNavController.prototype.isCurrent = function (route) {
                var currentState = this.$state.current;
                if (!route.title || !currentState || !currentState.title) {
                    return '';
                }
                var menuName = route.title;
                return currentState.title.substr(0, menuName.length) === menuName ? 'current' : '';
            };
            TopNavController.prototype.isNavbarActive = function (navBarPath) {
                return true;
                //return navBarPath === breadcrumbs.getFirst().name;
            };
            return TopNavController;
        }());
        TopNavController.$inject = ['$state', 'logger', 'securityService'];
        angular
            .module('app.layout')
            .directive('lpTopNav', LpTopNav.instance);
    })(layout = app.layout || (app.layout = {}));
})(app || (app = {}));
//# sourceMappingURL=lp-top-nav.directive.js.map