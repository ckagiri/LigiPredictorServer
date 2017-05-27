import {Request, Response} from 'express';
import * as _ from 'lodash';
import * as Rx from 'rxjs';
import {UserRepo} from '../../../db/repositories';

let userRepo = new UserRepo();
export class UserController { 
	show(req: Request, res: Response) {
		let {id} = req.params;
		userRepo.findOne({_id: id})
			.subscribe((user: any) => {
					res.status(200).json(user);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
    		});
  }

  list(req: Request, res: Response) {
		userRepo.findAll()
			.subscribe((users: any[]) => {
					res.status(200).json(users);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
				});		
	}
}