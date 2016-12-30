import * as Rx from 'rxjs';
import {config} from '../../../config/environment';
import {client} from './main.job';
import {seasonRepo, teamRepo} from '../index';

export default class CompetitionJob {
  private queue: any;
  private teamRepo = teamRepo;
  private seasonRepo = seasonRepo;
  private updatedTeamIds: any[];
  constructor(private comp: any){  }

  start(queue: any) {
    this.queue = queue;
    console.log("Competition job: " + this.comp.caption);

    Rx.Observable.fromPromise(client.getCompetitionById(this.comp.id).getTeams())
        .map(res => {
            return res.data.teams;
        })
        .flatMap(teams => {
            return this.teamRepo.findByNameAndUpdate(teams);
        })
        .flatMap((teams: any[]) => {
            this.updatedTeamIds = teams.map(function (team) {
                return team._id;
            });
            return this.seasonRepo.findOneByYearAndUpdate(this.comp);
        })
        .flatMap(function (comp: any) {
            this.updatedComp = comp;
            return this.seasonRepo.addTeams(comp._id, this.updatedTeamIds);
        })
        .flatMap(function () {
            return this.teamRepo.addCompetitions(this.updatedTeamIds, [this.updatedComp._id]);
        })
        .subscribe(function () {
            // let compStandingJob = new CompetitionStandingJob(self.savedComp);
            // self.queue.addJob(compStandingJob);

            // let compFixturesJob = new CompetitionFixturesJob(self.savedComp);
            // self.queue.addJob(compFixturesJob);

        }, function (err) {
            console.error(err);
        }, function () {
            console.log("Finished");
        });
    }
}
