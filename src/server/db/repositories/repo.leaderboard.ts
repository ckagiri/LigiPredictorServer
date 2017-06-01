import * as Rx from 'rxjs';
import {Leaderboard} from '../models/leaderboard.model';

export class LeaderboardRepo {
  updateStatus(query: any, update: any) {
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

	findOneBySeasonAndUpdateStatus(seasonId: string, status: string) {
		let query: any = {season: seasonId};
		let update: any  = {season: seasonId, status}
		return this.updateStatus(query, update)
	}

	findByIdAndUpdateStatus(leaderboardId: string, status: string) {
		let query: any = {_id: leaderboardId};
		let update: any  = {status}
		return this.updateStatus(query, update)
	}
}
