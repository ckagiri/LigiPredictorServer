import * as Rx from 'rxjs';
import * as _ from 'lodash';
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
    let competitionApiId = _.get(this.comp, apiDetailIdKey);
    Rx.Observable.fromPromise(client.getCompetitionById(competitionApiId).getFixtures())
      .map(function (res) {
        let fixtures = res.data.fixtures;
        for (let fixture of fixtures) {
          fixture.seasonId = competitionApiId
        }
        return fixtures;
      })
      .flatMap(function (fixtures) {
        return fixtureRepo.findBySlugAndUpdate(fixtures);
      })
      .subscribe(() => {
        }, (err) => {
            console.error(err);
        }, () => {
            console.log("Saved fixtures for : " + this.comp.caption)
        })
  }
}
