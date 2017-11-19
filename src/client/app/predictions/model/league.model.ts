namespace app.core {
  'use strict';

  factory.$inject = [];
  function factory() {
    class League { }
    return League;
  }

  angular
    .module('app.core')
    .factory('League', factory);
}