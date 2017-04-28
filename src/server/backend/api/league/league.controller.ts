import {Request, Response} from 'express';
import * as _ from 'lodash';
import {League} from './league.model';

export class LeagueController {

  list (req: Request, res: Response) {
    League.find({}, (err, leagues) => {
      if (err) {
        return res.status(500).json(err);
      };
      return res.status(200).json(leagues);
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