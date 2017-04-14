/**
 * LigiPredictorServer - Ligi Predictor Server
 * @authors 
 * @version v1.0.0
 * @link https://github.com/ckagiri/LigiPredictorServer#readme
 * @license ISC
 */
var app;!function(t){"use strict";angular.module("app",["app.core","app.widgets","app.admin","app.dashboard","app.layout"])}(app||(app={}));var app;!function(t){var e;!function(t){"use strict";angular.module("app.admin",["app.core","app.widgets"])}(e=t.admin||(t.admin={}))}(app||(app={}));var blocks;!function(t){var e;!function(t){"use strict";angular.module("blocks.exception",["blocks.logger"])}(e=t.exception||(t.exception={}))}(blocks||(blocks={}));var blocks;!function(t){var e;!function(t){"use strict";angular.module("blocks.logger",[])}(e=t.logger||(t.logger={}))}(blocks||(blocks={}));var blocks;!function(t){var e;!function(t){"use strict";angular.module("blocks.router",[])}(e=t.router||(t.router={}))}(blocks||(blocks={}));var app;!function(t){var e;!function(t){"use strict";angular.module("app.core",["ngAnimate","ngSanitize","blocks.exception","blocks.logger","blocks.router","ui.router","ngplus"])}(e=t.core||(t.core={}))}(app||(app={}));var app;!function(t){var e;!function(t){"use strict";angular.module("app.dashboard",["app.core","app.widgets"])}(e=t.dashboard||(t.dashboard={}))}(app||(app={}));var app;!function(t){var e;!function(t){"use strict";angular.module("app.layout",["app.core"])}(e=t.layout||(t.layout={}))}(app||(app={}));var app;!function(t){var e;!function(t){"use strict";angular.module("app.widgets",[])}(e=t.widgets||(t.widgets={}))}(app||(app={}));var app;!function(t){var e;!function(t){"use strict";var e=function(){function t(t){this.logger=t,this.title="Admin",this.logger.info("Activated Admin View")}return t.$inject=["logger"],t}();e.$inject=["logger"],t.AdminController=e,angular.module("app.admin").controller("AdminController",e)}(e=t.admin||(t.admin={}))}(app||(app={}));var app;!function(t){var e;!function(t){"use strict";function e(t){var e=a();e.forEach(function(e){t.state(e.state,e.config)})}function a(){return[{state:"admin",config:{url:"/admin",templateUrl:"app/admin/admin.html",controller:"AdminController",controllerAs:"vm",title:"Admin",settings:{nav:2,content:'<i class="fa fa-lock"></i> Admin'}}}]}angular.module("app.admin").config(e),e.$inject=["$stateProvider"]}(e=t.admin||(t.admin={}))}(app||(app={}));var blocks;!function(t){var e;!function(t){"use strict";function e(t){t.decorator("$exceptionHandler",a)}function a(t,e,a){return function(i,n){var o=e.config.appErrorPrefix||"",r={exception:i,cause:n};i.message=o+i.message,t(i,n),a.error(i.message,r)}}var i=function(){function t(){var t=this;this.config={appErrorPrefix:void 0},this.$get=function(){return{config:t.config}}}return t.prototype.configure=function(t){this.config.appErrorPrefix=t},t}();i.$inject=[],t.ExceptionHandlerProvider=i,e.$inject=["$provide"],a.$inject=["$delegate","exceptionHandler","logger"],angular.module("blocks.exception").provider("exceptionHandler",i).config(e)}(e=t.exception||(t.exception={}))}(blocks||(blocks={}));var blocks;!function(t){var e;!function(t){"use strict";var e=function(){function t(t){var e=this;this.logger=t,this.catcher=function(t){return function(a){return e.logger.error(t,a)}}}return t.$inject=["logger"],t}();e.$inject=["logger"],t.Exception=e,angular.module("blocks.exception").service("exception",e)}(e=t.exception||(t.exception={}))}(blocks||(blocks={}));var blocks;!function(t){var e;!function(t){"use strict";var e=function(){function t(t,e){this.$log=t,this.toastr=e}return t.$inject=["$log","toastr"],t.prototype.log=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this.$log.log(t)},t.prototype.error=function(t,e,a){this.toastr.error(t,a),this.$log.error("Error: "+t,"\nSummary:",a,"\nDetails:",e)},t.prototype.info=function(t,e,a){this.toastr.info(t,a),this.$log.info("Info: "+t,"\nSummary:",a,"\nDetails:",e)},t.prototype.success=function(t,e,a){this.toastr.success(t,a),this.$log.info("Success: "+t,"\nSummary:",a,"\nDetails:",e)},t.prototype.warning=function(t,e,a){this.toastr.warning(t,a),this.$log.warn("Warning: "+t,"\nSummary:",a,"\nDetails:",e)},t}();e.$inject=["$log","toastr"],t.Logger=e,angular.module("blocks.logger").service("logger",e)}(e=t.logger||(t.logger={}))}(blocks||(blocks={}));var blocks;!function(t){var e;!function(t){"use strict";var e=function(){function t(t,e,a,i){this.$location=t,this.$rootScope=e,this.$state=a,this.logger=i,this.stateCounts={errors:0,changes:0},this.handlingStateChangeError=!1,this.handleRoutingErrors(),this.handleStateChanges()}return t.$inject=["$location","$rootScope","$state","logger"],t.prototype.handleRoutingErrors=function(){var t=this;this.$rootScope.$on("$stateChangeError",function(e,a,i,n,o,r){if(!t.handlingStateChangeError){t.stateCounts.errors++,t.handlingStateChangeError=!0;var s=a&&(a.title||a.name||a.loadedTemplateUrl)||"unknown target",l="Error routing to "+s+". "+(r.data||"")+". <br/>"+(r.statusText||"")+": "+(r.status||"");t.logger.warning(l,[a]),t.$location.path("/")}})},t.prototype.handleStateChanges=function(){var t=this;this.$rootScope.$on("$stateChangeSuccess",function(e,a,i,n,o,r){t.stateCounts.changes++,t.handlingStateChangeError=!1;var s=a.title||"";t.$rootScope.title=s})},t}();e.$inject=["$location","$rootScope","$state","logger"],t.RouterHelper=e,angular.module("blocks.router").service("RouterHelper",e)}(e=t.router||(t.router={}))}(blocks||(blocks={}));var app;!function(t){var e;!function(t){"use strict";function e(t){t.options.timeOut=4e3,t.options.positionClass="toast-bottom-right"}function a(t,e){t.debugEnabled&&t.debugEnabled(!0),e.configure(i.appErrorPrefix)}var i={appErrorPrefix:"[helloworld Error] ",appTitle:"helloworld"};angular.module("app.core").config(e).config(a).value("config",i),e.$inject=["toastr"],a.$inject=["$logProvider","exceptionHandlerProvider"]}(e=t.core||(t.core={}))}(app||(app={}));var app;!function(t){var e;!function(t){"use strict";angular.module("app.core").constant("toastr",toastr).constant("moment",moment)}(e=t.core||(t.core={}))}(app||(app={}));var app;!function(t){var e;!function(t){"use strict";function e(t){}function a(t,e,a){var n="/404",o=i();o.forEach(function(e){t.state(e.state,e.config)}),e.html5Mode(!0),a.otherwise(n)}function i(){return[{state:"404",config:{url:"/404",templateUrl:"app/core/404.html",title:"404"}}]}angular.module("app.core").config(a).run(e),e.$inject=["RouterHelper"],a.$inject=["$stateProvider","$locationProvider","$urlRouterProvider"]}(e=t.core||(t.core={}))}(app||(app={}));var app;!function(t){var e;!function(t){"use strict";var e=function(){function t(t,e,a,i){var n=this;this.$http=t,this.$q=e,this.exception=a,this.logger=i,this.getMessageCount=function(){return n.$q.when(72)},this.getPeople=function(){return n.$http.get("/api/people").then(n.success)["catch"](n.fail)},this.success=function(t){return t.data},this.fail=function(t){var e=t.data.description,a="query for people failed.";return n.exception.catcher(e)(a),n.$q.reject(e)}}return t.$inject=["$http","$q","exception","logger"],t}();e.$inject=["$http","$q","exception","logger"],t.DataService=e,angular.module("app.core").service("dataservice",e)}(e=t.core||(t.core={}))}(app||(app={}));var app;!function(t){var e;!function(t){"use strict";var e=function(){function t(t,e,a){this.$q=t,this.dataservice=e,this.logger=a,this.news={title:"helloworld",description:"Hot Towel Angular is a SPA template for Angular developers."},this.messageCount=0,this.people=[],this.title="Dashboard";var i=[this.getMessageCount(),this.getPeople()];this.$q.all(i).then(function(){a.info("Activated Dashboard View")})}return t.$inject=["$q","dataservice","logger"],t.prototype.getMessageCount=function(){var t=this;return this.dataservice.getMessageCount().then(function(e){return t.messageCount=e,t.messageCount})},t.prototype.getPeople=function(){var t=this;return this.dataservice.getPeople().then(function(e){return t.people=e,t.people})},t}();e.$inject=["$q","dataservice","logger"],t.DashboardController=e,angular.module("app.dashboard").controller("DashboardController",e)}(e=t.dashboard||(t.dashboard={}))}(app||(app={}));var app;!function(t){var e;!function(t){"use strict";function e(t){var e=a();e.forEach(function(e){t.state(e.state,e.config)})}function a(){return[{state:"dashboard",config:{url:"/",templateUrl:"app/dashboard/dashboard.html",controller:"DashboardController",controllerAs:"vm",title:"dashboard",settings:{nav:1,content:'<i class="fa fa-dashboard"></i> Dashboard'}}}]}angular.module("app.dashboard").config(e),e.$inject=["$stateProvider"]}(e=t.dashboard||(t.dashboard={}))}(app||(app={}));var app;!function(t){var e;!function(t){"use strict";var e=function(){function t(){this.bindToController=!0,this.link=this.linkFn,this.restrict="EA",this.scope={whenDoneAnimating:"&?"}}return t.instance=function(){return new t},t.prototype.linkFn=function(t,e,a){function i(e){var a="dropy";e.preventDefault(),o.hasClass(a)?o.hasClass(a)&&(o.removeClass(a),n.slideUp(350,t.whenDoneAnimating)):(n.slideDown(350,t.whenDoneAnimating),o.addClass(a))}var n=e.find(".sidebar-inner"),o=e.find(".sidebar-dropdown a");e.addClass("sidebar"),o.click(i)},t}();e.$inject=[""],angular.module("app.layout").directive("htSidebar",e.instance)}(e=t.layout||(t.layout={}))}(app||(app={}));var applayout;!function(t){"use strict";var e=function(){function t(){this.bindToController=!0,this.controller=a,this.controllerAs="vm",this.restrict="EA",this.scope={navline:"="},this.templateUrl="app/layout/ht-top-nav.html"}return t.instance=function(){return new t},t}();e.$inject=[""];var a=function(){function t(){}return t}();angular.module("app.layout").directive("htTopNav",e.instance)}(applayout||(applayout={}));var app;!function(t){var e;!function(t){"use strict";var e=function(){function t(t,e,a,i){this.$rootScope=t,this.$timeout=e,this.config=a,this.logger=i,this.busyMessage="Please wait ...",this.isBusy=!0,this.navline={title:this.config.appTitle,text:"Created by John Papa",link:"http://twitter.com/john_papa"},this.logger.success(a.appTitle+" loaded!",null),this.hideSplash(),this.$rootScope.showSplash=!0}return t.$inject=["$rootScope","$timeout","config","logger"],t.prototype.hideSplash=function(){var t=this;this.$timeout(function(){t.$rootScope.showSplash=!1},1e3)},t}();e.$inject=["$rootScope","$timeout","config","logger"],t.ShellController=e,angular.module("app.layout").controller("ShellController",e)}(e=t.layout||(t.layout={}))}(app||(app={}));var app;!function(t){var e;!function(t){"use strict";var e=function(){function t(t){this.$state=t,this.states=this.$state.get(),this.getNavRoutes()}return t.$inject=["$state"],t.prototype.isCurrent=function(t){var e=this.$state.current;if(!t.title||!e||!e.title)return"";var a=t.title;return e.title.substr(0,a.length)===a?"current":""},t.prototype.getNavRoutes=function(){this.navRoutes=this.states.filter(function(t){return t.settings&&t.settings.nav}).sort(function(t,e){return t.settings.nav-e.settings.nav})},t}();e.$inject=["$state"],t.SidebarController=e,angular.module("app.layout").controller("SidebarController",e)}(e=t.layout||(t.layout={}))}(app||(app={}));var app;!function(t){var e;!function(t){"use strict";var e=function(){function t(){this.scope={title:"@",subtitle:"@",rightText:"@",allowCollapse:"@"},this.templateUrl="app/widgets/widget-header.html",this.restrict="EA"}return t.instance=function(){return new t},t}();e.$inject=[""],angular.module("app.widgets").directive("htWidgetHeader",e.instance)}(e=t.widgets||(t.widgets={}))}(app||(app={})),angular.module("app.core").run(["$templateCache",function(t){t.put("app/admin/admin.html",'<section class=mainbar><section class=matter><div class=container><div class=row><div class="widget wviolet"><div ht-widget-header title={{vm.title}}></div><div class="widget-content user"><h3>TODO: Implement Your Features</h3></div><div class=widget-foot><div class=clearfix></div></div></div></div></div></section></section>'),t.put("app/core/404.html",'<section id=dashboard-view class=mainbar><section class=matter><div class=container><div class=row><div class=col-md-12><ul class=today-datas><li class=bred><div class=pull-left><i class="fa fa-warning"></i></div><div class="datas-text pull-right"><a><span class=bold>404</span></a>Page Not Found</div><div class=clearfix></div></li></ul></div></div><div class=row><div class="widget wblue"><div ht-widget-header title="Page Not Found" allow-collapse=true></div><div class="widget-content text-center text-info"><div class=container>No soup for you!</div></div><div class=widget-foot><div class=clearfix></div></div></div></div></div></section></section>'),t.put("app/dashboard/dashboard.html",'<section id=dashboard-view class=mainbar><section class=matter><div class=container><div class=row><div class=col-md-12><ul class=today-datas><li class=blightblue><div class=pull-left><i class="fa fa-plane"></i></div><div class="datas-text pull-right"><span class=bold>May 18 - 19, 2015</span> Castle Resort, Neverland</div><div class=clearfix></div></li><li class=borange><div class=pull-left><i class="fa fa-envelope"></i></div><div class="datas-text pull-right"><span class=bold>{{vm.messageCount}}</span> Messages</div><div class=clearfix></div></li></ul></div></div><div class=row><div class=col-md-6><div class="widget wviolet"><div ht-widget-header title=People allow-collapse=true></div><div class="widget-content text-center text-info"><table class="table table-condensed table-striped"><thead><tr><th>First Name</th><th>Last Name</th><th>Age</th><th>Location</th></tr></thead><tbody><tr ng-repeat="p in vm.people"><td>{{p.firstName}}</td><td>{{p.lastName}}</td><td>{{p.age}}</td><td>{{p.location}}</td></tr></tbody></table></div><div class=widget-foot><div class=clearfix></div></div></div></div><div class=col-md-6><div class="widget wgreen"><div ht-widget-header title={{vm.news.title}} allow-collapse=true></div><div class="widget-content text-center text-info"><small>{{vm.news.description}}</small></div><div class=widget-foot><div class=clearfix></div></div></div></div></div></div></section></section>'),t.put("app/layout/ht-top-nav.html",'<nav class="navbar navbar-fixed-top navbar-inverse"><div class=navbar-header><a href="/" class=navbar-brand><span class=brand-title>{{vm.navline.title}}</span></a> <a class="btn navbar-btn navbar-toggle" data-toggle=collapse data-target=.navbar-collapse><span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></a></div><div class="navbar-collapse collapse"><div class="pull-right navbar-logo"><ul class="nav navbar-nav pull-right"><li><a ng-href={{vm.navline.link}} target=_blank>{{vm.navline.text}}</a></li><li class="dropdown dropdown-big"><a href=http://www.angularjs.org target=_blank><img src=images/AngularJS-small.png></a></li><li><a href="http://www.gulpjs.com/" target=_blank><img src=images/gulp-tiny.png></a></li></ul></div></div></nav>'),t.put("app/layout/shell.html",'<div ng-controller="ShellController as vm"><header class=clearfix><ht-top-nav navline=vm.navline></ht-top-nav></header><section id=content class=content><div ng-include="\'app/layout/sidebar.html\'"></div><div ui-view class=shuffle-animation></div><div ngplus-overlay ngplus-overlay-delay-in=50 ngplus-overlay-delay-out=700 ngplus-overlay-animation=dissolve-animation><img src=images/busy.gif><div class="page-spinner-message overlay-message">{{vm.busyMessage}}</div></div></section></div>'),t.put("app/layout/sidebar.html",'<div ng-controller="SidebarController as vm"><ht-sidebar when-done-animating=vm.sidebarReady()><div class=sidebar-filler></div><div class=sidebar-dropdown><a href=#>Menu</a></div><div class=sidebar-inner><div class=sidebar-widget></div><ul class=navi><li class="nlightblue fade-selection-animation" ng-class=vm.isCurrent(r) ng-repeat="r in vm.navRoutes"><a ui-sref={{r.name}} ng-bind-html=r.settings.content></a></li></ul></div></ht-sidebar></div>'),t.put("app/widgets/widget-header.html",'<div class=widget-head><div class="page-title pull-left">{{title}}</div><small class=page-title-subtle ng-show=subtitle>({{subtitle}})</small><div class="widget-icons pull-right"></div><small class="pull-right page-title-subtle" ng-show=rightText>{{rightText}}</small><div class=clearfix></div></div>')}]);