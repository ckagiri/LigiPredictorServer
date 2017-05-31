import * as Rx from 'rxjs';
import {BoardInfo} from '../models/board-info.model';

export class BoardInfoRepo {
  updateStatus(seasonId: string, round: number, status: string) {
		let options = { upsert: true, new: true };
		let query: any = {season: seasonId};

		if(round !== null) {
			query = {$and: [{'season': seasonId}, {round}]}
		}

		return Rx.Observable.fromPromise(
			new Promise((resolve: any, reject: any) => {    
				BoardInfo.findOneAndUpdate(query, 
					{season: seasonId, status: status}, 
					{new: true, upsert: true}, 
        	(err:any, result:any) => {
						if(err){
							return reject(err);
						}
						resolve(result);
					})
			}))
	}
}
