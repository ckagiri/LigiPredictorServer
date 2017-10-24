import {seasonRepo} from '../common'
import * as Rx from 'rxjs'
import * as _ from 'lodash';

let createIdToSeasonMap = (seasons: any[]) => {
	let map = {};
	for (let season of seasons) {
		map[season.id] = season;
	}
	return map;
};

class SeasonUpdateHandler {
  handle(seasons: any[]) {
		let idToCompMap = createIdToSeasonMap(seasons);
		let apiIds = [];
		for (let season of seasons) {
			if (season.id !== 445) {
				continue;
			}  
			apiIds.push(season.id);
		}
		seasonRepo.getByApiIds(apiIds)
			.flatMap((seasons: any) => {
				return Rx.Observable.from(seasons)
			})
			.subscribe((season: any) => {
				let apiDetailIdKey = seasonRepo.apiDetailIdKey();
				let compId = _.get(season, apiDetailIdKey, '');
				let newCurrentRound = idToCompMap[compId].currentMatchday;
				if (season.currentRound !== newCurrentRound) {
					Rx.Observable.fromPromise(seasonRepo.updateCurrentRound(season._id, newCurrentRound))
						.subscribe(() => {
							console.log("current round of " + season.name + " has updated");
						})
				} else {
					console.log("current round of " + season.name + " is updated already");
				}
			})
	}
}

export const seasonUpdateHandler = new SeasonUpdateHandler()