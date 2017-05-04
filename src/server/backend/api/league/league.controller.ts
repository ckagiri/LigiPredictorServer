import {Request, Response} from 'express';
import * as _ from 'lodash';
import {League, ILeague, ILeagueModel} from '../../../db/models/league.model';
import {LeagueRepo} from '../../../db/repositories/repo.league';
import {LeagueConverter} from '../../../db/converters/ligi-predictor/converter.league';

export class LeagueController {
	private leaguRepo = new LeagueRepo(new LeagueConverter());
  list (req: Request, res: Response) {
		this.leaguRepo.findAll()
			.subscribe((leagues: ILeagueModel[]) => {
					res.status(200).json(leagues);
				}, (err: any) => {
					console.error(err);
					res.status(500).json(err);
    		});
  }

  show(req: Request, res: Response) {
    League.findById(req.params.id, (err, league) => {
      if (err) {
        return res.status(500).json(err);
      };
      if (!league) {
        return res.status(404);
      } 

      return res.status(200).json(league);
    })
  }

  create(req: Request, res: Response) {
    let newLeague = req.body;
    League.create(newLeague, (err, league) => {
      if (err) {
				console.log(err);
        return res.status(400).json(err);
      }
      return res.status(201).json(league);
    });
  }

  update(req: Request, res: Response) {
    League.findById(req.params.id, (err, league) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (!league) {
      return res.sendStatus(404);
    }   

    _.merge(league, req.body);    
    league.save(err => {
      if (err) {
        return res.status(400).json(err);
      }
      return res.status(200).json(league);
      });
    });
  }

  destroy(req: Request, res: Response) {
    League.findById(req.params.id, (err, league) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (!league) {
        return res.sendStatus(404);
      }
      league.remove(err => {
        if (err) {
          return res.status(400).json(err);
        }
        return res.sendStatus(200);
      });
    });
  }
}