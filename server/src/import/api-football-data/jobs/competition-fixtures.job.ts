import * as Rx from 'rxjs';
import {config} from '../../../config/environment';
import {client} from './main.job';
import {seasonRepo, teamRepo, fixtureRepo} from '../index';

export class CompetitionFixturesJob {
  private fixturesRepo = fixtureRepo;
  private seasonRepo = seasonRepo;
  private teamRepo = teamRepo;

  constructor(private comp: any){ }

  start() {
    console.log("Competition fixtures job" + JSON.stringify(this.comp));

    let apiDetailIdKey = teamRepo.apiDetailIdKey();
    Rx.Observable.fromPromise(client.getCompetitionById(this.comp[apiDetailIdKey]).getFixtures())
      .map(function (res) {
        return res.data.fixtures;
      })
      .flatMap(function (fixtures) {
        return fixtureRepo.findBySlugAndUpdate(fixtures);
      })
      .subscribe(() => {
        }, (err) => {
            console.error(err);
        }, () => {
            console.log("Saved fixtures for : " + this.comp.name)
        })
  }
}
