import * as Rx from 'rxjs'
import {fixtureRepo, userRepo, predictionRepo} from '../common'
import {predictionProcessor} from '../../../helpers/prediction-processor';

class FixturePublishHandler {
  handle(changedFixture: any): Rx.Observable<any> {
    let boards = {};
    console.log("prediction handler");
    if (changedFixture.status === 'FINISHED') {
      return userRepo.findAll()
        .flatMap((users: any[]) => {
          return Rx.Observable.from(users);
        })
        .flatMap((user: any) => {
          return Rx.Observable.of({
            user, fixture: changedFixture
          })
        })
        .flatMap((map: any) => {
          let {user, fixture} = map;
          return predictionRepo.findOneOrCreate(user, fixture, fixture.odds)
            .map((prediction: any) => {
              return {
                user, fixture, prediction
              }
            })
        })
        .flatMap((map: any) => {
          let {user, fixture, prediction} = map;
          let score = predictionProcessor.process(prediction.choice, fixture.result);
          prediction.scorePoints = score.scorePoints;
          prediction.points = score.points;
          prediction.goalDiff = score.goalDiff;
          return Rx.Observable.of({user, fixture, prediction})
        })
    }
    return Rx.Observable.throw(new Error(`Oops!! fixture: ${changedFixture._id}`));
  }
}
export const fixturePublishHandler = new FixturePublishHandler();