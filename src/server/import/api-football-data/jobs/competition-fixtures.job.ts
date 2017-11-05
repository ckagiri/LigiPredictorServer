import * as Rx from 'rxjs';
import * as _ from 'lodash';
import {config} from '../../../config/environment';
import {client} from './main.job';
import {fixtureRepo} from '../index';

export class CompetitionFixturesJob {
  private fixtureRepo = fixtureRepo;

  constructor(private comp: any){ }

  start() {
    console.log("Competition fixtures job" + JSON.stringify(this.comp));

    let apiDetailIdKey = fixtureRepo.apiDetailIdKey();
    let competitionApiId = _.get(this.comp, apiDetailIdKey);
    Rx.Observable.fromPromise(client.getCompetitionById(competitionApiId).getFixtures())
      .map(function (res:any) {
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
