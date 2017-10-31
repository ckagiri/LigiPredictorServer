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
        .flatMap((map:any) => {
          let {user, fixture} = map; 
          let {season, round} = fixture;
          if(roundFixtures.length === 0) {
            return Rx.Observable.of({
              user, fixture
            })
          }
          return predictionRepo.pickJoker({user, season, round, pick: roundFixtures})
            .map((jokerPrediction: any) => {
              return {
                user, fixture, jokerPrediction
              }
            });
        })
        .flatMap((map: any) => {
          let {user, fixture, jokerPrediction} = map; 
          if (jokerPrediction && jokerPrediction.fixture.toString() == fixture._id.toString()) {
            return Rx.Observable.of({
              user, fixture, prediction:jokerPrediction
            })
          }
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