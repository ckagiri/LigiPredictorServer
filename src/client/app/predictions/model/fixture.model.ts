namespace app.core {
  'use strict';

  function factory() {
    class Fixture {
      static key: string = '_id';
      constructor(data: any) {
        angular.extend(this, data);
      }
    }
    return Fixture;
  }

  angular
    .module('app.core')
    .factory('Fixture', factory);
}