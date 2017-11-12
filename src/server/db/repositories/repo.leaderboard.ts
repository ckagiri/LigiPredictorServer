import * as Rx from 'rxjs';
import {Leaderboard} from '../models/leaderboard.model';

export class LeaderboardRepo {
  findOneAndUpdate(query: any, update: any) {
		let options = { upsert: true, new: true };

		return Rx.Observable.fromPromise(
			new Promise((resolve: any, reject: any) => {    
				Leaderboard.findOneAndUpdate(query, update, 
					{new: true, upsert: true}, 
        	(err:any, result:any) => {
						if(err){
							return reject(err);
						}
						resolve(result);
					})
			}))
	}

	findOneBySeasonAndUpdate(options: any) {
		let {season} = options;
		let boardType = 'GLOBAL_SEASON';
		options.boardType = boardType;
		let query: any = {season, boardType};
		return this.findOneAndUpdate(query, options)
	}

	findOneByRoundAndUpdate(options: any) {
		let {season, round} = options;
		let boardType = 'GLOBAL_ROUND';
		options.boardType = boardType;
		let query: any = {season, round, boardType};
		return this.findOneAndUpdate(query, options)
	}

	findByIdAndUpdateStatus(leaderboardId: string, status: string) {
		let query: any = {_id: leaderboardId};
		let update: any  = {status}
		return this.findOneAndUpdate(query, update)
	}

	findAll(query: any = {}, projection?: any, options?: any) {
		return Rx.Observable.fromPromise(Leaderboard.find(query, projection, options).lean());
	}

	findOne(query: any, projection?: any){
    return Rx.Observable.fromPromise(Leaderboard.findOne(query, projection));
  }

	findAllBySeason(seasonId: string) {
		return this.findAll({season: seasonId})
	}

	findAllBySeasonRound(seasonId: string, round: number) {
		let query = {$and: [{season: seasonId}, {round}]}
		return this.findAll(query, null, {sort: 'date'})
	}

	findAllBySeasonMonth(seasonId: string, year: number, month: number) {
		let query = {$and: [{season: seasonId}, {year}, {month}]}
		return this.findAll(query, null, {sort: 'date'})
	}
}
