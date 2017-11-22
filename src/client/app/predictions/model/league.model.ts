namespace app.core {
  'use strict';

  function factory() {
    class League { }
    return League;
  }

  angular
    .module('app.core')
    .factory('League', factory);
}