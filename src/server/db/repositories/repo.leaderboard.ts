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

	findOneByMonthAndUpdate(options: any) {
		let {season, year, month} = options;
		let boardType = 'GLOBAL_MONTH';
		options.boardType = boardType;
		let query: any = {season, year, month, boardType};
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

	findSeasonBoard(seasonId: string) {
		return this.findOne({season: seasonId, boardType: 'GLOBAL_SEASON'})
	}

	findRoundBoard(seasonId: string, round: number) {
		let query = {$and: [{season: seasonId}, {round}, {boardType: 'GLOBAL_ROUND'}]};
		return this.findOne(query)
	}

	findMonthBoard(seasonId: string, year: number, month: number) {
		let query = {$and: [{season: seasonId}, {year}, {month}, {boardType: 'GLOBAL_MONTH'}]}
		return this.findOne(query)
	}
}
