namespace app.core {
  'use strict';


  export class Filter {
    round: number;

    private modelTest(item: any) {
      // Return true if it meets the filter criteria. Otherwise, return false
      if(this.round === -1) return true;
      if (this.round !== item.round) return false;
      return true;
    }

    predicate(item: any) {
      let match = this.modelTest(item);
      return match;
    }
  }

  angular.module('app.core').service('predictionFilter', Filter);
}

