namespace app.core {
  'use strict';


  export class Filter {
    roundId: number;

    private modelTest(item: any) {
      // Return true if it meets the filter criteria. Otherwise, return false
      if (this.roundId !== item.roundId) return false;
      return true;
    }

    predicate(item: any) {
      let match = this.modelTest(item);
      return match;
    }
  }

  angular.module('app.core').service('predictionFilter', Filter);
}

