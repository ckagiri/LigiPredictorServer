import {Request, Response} from 'express';
import {nextMatchUpdate as nextGameUpdate, msToTime} from '../../tasks/scheduler';
import {client as afdClient} from '../../tasks/common';
import * as Rx from 'rxjs';

export class AdminController {
  nextMatchUpdate(req: Request, res: Response) {
    let{nextMatchUpdateMs, previousMatchUpdateMs, nextMatchUpdateDate} = nextGameUpdate();
    let nextTime = msToTime(nextMatchUpdateMs);
    let prevTime = msToTime(previousMatchUpdateMs);
    res.status(200).json({nextTime, prevTime, nextMatchUpdateDate});
  }

  showAfdFixture(req: Request, res: Response) {
    let compId = 445;
    let {id} = req.params;
    Rx.Observable.fromPromise(afdClient.getFixture(compId, id))
		.subscribe((fixture: any) => {
        res.status(200).json(fixture);
      }, (err: any) => {
        res.status(500).json({error: 'bad'})
      });
  }

  showAfdMatchdayFixtures(req: Request, res: Response) {
    let compId = 445;
    let {matchday} = req.params;
    matchday = parseInt(matchday);
    Rx.Observable.fromPromise(afdClient.getFixtures(compId, {matchday}))
		.subscribe((fixtures: any) => {
        res.status(200).json(fixtures);
      }, (err: any) => {
        res.status(500).json({error: 'bad'})
      });
  }
}