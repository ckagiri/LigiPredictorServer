import * as Rx from 'rxjs';
import {config} from '../../../config/environment';
import {client} from './main.job';
import {seasonRepo, teamRepo} from '../index';
import {CompetitionFixturesJob} from './competition-fixtures.job';

export default class CompetitionJob {
  private queue: any;
  private teamRepo = teamRepo;
  private seasonRepo = seasonRepo;
  private updatedTeamIds: any[];

  constructor(private comp: any){ }

  start(queue: any) {
    this.queue = queue;
    console.log("Competition job: " + this.comp.caption);

    Rx.Observable.fromPromise(client.getCompetitionById(this.comp.id).getTeams())
        .map(res => {
          return res.data.teams;
        })
        .flatMap(teams => {
          return  this.teamRepo.findByNameAndUpdate(teams);
        })
        .flatMap((teams: any[]) => {
          return this.seasonRepo.findByApiIdAndUpdate(this.comp);
        })
        .subscribe(savedComp => {
            let compFixturesJob = new CompetitionFixturesJob(savedComp);
            this.queue.addJob(compFixturesJob);
            console.log('subscribed');
        }, function (err) {
            console.error(err);
        }, function () {
            console.log("Finished");
        });
    }
}
