import * as Rx from 'rxjs';
import {BoardInfo} from '../models/board-info.model';

export class BoardInfoRepo {
  updateStatus(seasonId: string, status: string) {
		let options = { upsert: true, new: true };
		return Rx.Observable.fromPromise(
			new Promise((resolve: any, reject: any) => {    
				BoardInfo.findOneAndUpdate({season: seasonId}, 
					{season: seasonId, status: status}, 
					{new: true, upsert: true}, 
        	(err:any, updatedObj:any) => {
						if(err){
							return reject(err);
						}
						resolve(updatedObj);
					})
			}))
	}
}
