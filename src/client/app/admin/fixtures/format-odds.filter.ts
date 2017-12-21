namespace admin.fixtures {
	'use strict';

  function formatOdds() {
    return function(input: any) {
      let text = '';
      if(input == null) {
        text = '1, 1, 1'
      } else {
        let homeWin = input.homeWin;
        let awayWin = input.awayWin;
        let draw = input.draw;
        text = `${homeWin}, ${draw}, ${awayWin}`;
      }
      return text;
    }
  }
  angular.module('admin.fixtures').filter('formatOdds', formatOdds);
}