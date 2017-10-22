import * as Rx from 'rxjs'
import {fixtureRepo, userRepo, predictionRepo} from '../common'
import {predictionProcessor} from '../../../helpers/prediction-processor';

class FinishedFixturePublishHandler {
  handle(changedFixture: any, roundFixtures: [string]): Rx.Observable<any> {
    let boards = {};
    console.log("prediction handler");
      return userRepo.findAll()
        .flatMap((users: any[]) => {
          return Rx.Observable.from(users);
        })
        .flatMap((user: any) => {
          return Rx.Observable.of({
            user, fixture: changedFixture
          })
        })
        // pickJoker newJoker
        .flatMap((map: any) => {
          let {user, fixture} = map; // if newJokerFixture = fixture resolve else cont
          return predictionRepo.findOneOrCreate(user, fixture)
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
}
export const finishedFixturePublishHandler = new FinishedFixturePublishHandler();