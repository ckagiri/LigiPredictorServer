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
        .flatMap((user:any) => {
          let {season, round} = changedFixture;
          return predictionRepo.pickJoker({user, season, round, pick: roundFixtures})
            .map((jokerPrediction: any) => {
              return {
                user, jokerPrediction
              }
            })
            .catch((error:any) => {
              let message = `Error: ${error.message || 'damn'}`;
              console.log(message);
              console.log("Caught Error, continuing")
              return Rx.Observable.of({
                user, jokerPrediction: null
              });
            });;
        })
        .flatMap((map: any) => {
          let {user, jokerPrediction} = map; 
          if (jokerPrediction && jokerPrediction.fixture.toString() == changedFixture._id.toString()) {
            return Rx.Observable.of({
              user, prediction:jokerPrediction
            })
          }
          return predictionRepo.findOneOrCreate(user, changedFixture)
            .map((prediction: any) => {
              return {
                user, prediction
              }
            })
        })
        .flatMap((map: any) => {
          let {user, prediction} = map;
          let fixture = changedFixture;
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