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
          return predictionRepo.pickJoker({user, season, round, pick: roundFixtures})
            .map((jokerPrediction: any) => {
              return {
                user, fixture, jokerPrediction
              }
            });
        })
        .flatMap((map: any) => {
          let {user, fixture, jokerPrediction} = map; 
          if (jokerPrediction.fixture.toString() == fixture._id.toString()) {
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
          let predictionStatus = 'PROCESSED';
          if(fixture.status === 'CANCELED' || fixture.status === 'POSTPONED') {
            predictionStatus = 'CANCELLED';
          }
          if(prediction.status === 'PROCESSED') {
            predictionStatus = 'ALREADY_PROCESSED';
          }
          prediction.status = predictionStatus;
          if(predictionStatus === 'CANCELLED' || predictionStatus === 'ALREADY_PROCESSED') {
            return Rx.Observable.of({user, fixture, prediction})
          }
          let score = predictionProcessor.process(prediction.choice, fixture.result);
          prediction.scorePoints = score.scorePoints;
          prediction.points = score.points;
          prediction.goalDiff = score.goalDiff;
          return Rx.Observable.of({user, fixture, prediction})
        })
    }
}
export const finishedFixturePublishHandler = new FinishedFixturePublishHandler();