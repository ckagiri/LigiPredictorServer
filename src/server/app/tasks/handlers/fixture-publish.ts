import * as Rx from 'rxjs'
import {fixtureRepo, userRepo, predictionRepo} from '../common'
import {predictionProcessor} from '../../../helpers/prediction-processor';

class PredictionHandler {
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
export const predictionHandler = new PredictionHandler();











//           oError: (err: any) => console.log(`Oops... ${err}`),
//           onComplete: () => {
//             leaderboardRepo.findAll({q: season})
//               .flatMap((standings: any) => {
//                 return Rx.Observable.from(standings);
//               })
//               .flatMap((standing: any) => {
//                 let position = 1;
//                 let previousPosition = standing.posNew;
//                 standing.posOld = previousPosition;
//                 standing.posNew = position;
//                 return leaderboardRepo.insert(standing)
//               })
//               .subscribe((standing: any) => {

//               });
//         }
//       })
//   }
// }