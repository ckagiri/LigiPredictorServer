import * as Rx from 'rxjs'
import {fixtureRepo, userRepo, predictionRepo} from '../common'
import {predictionProcessor} from '../../../helpers/prediction-processor';

class FixturePublishHandler {
  handle(changedFixture: any) {
    let boards = {};
    console.log("fixture publish handler");
    if (changedFixture.status === 'FINISHED') {
      userRepo.findAll()
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
        .subscribe(
          (map: any) => {
            let {user, fixture, prediction} = map;
            predictionRepo.insert(prediction)
              .do(() => {
                // if(!boards[fixture.season]) {
                //   return boardInfoRepo.updateStatus('compute-started')
                //     .onErrorResumeNext(Rx.Observable.empty())
                // }
                return Rx.Observable.empty()
              })
              .flatMap((pred) => {
                let userId = user.id;
                let seasonId = fixture.seasonId;
                let predictionId = prediction.id;
                let predictionScore = prediction.score;
                //return leaderboardRepo.findOneAndUpdateScore(userId, seasonId, predictionId, predictionScore)
                return Rx.Observable.empty()
              }).subscribe(() => {})
          },
          (err: any) => {console.log(`Oops... ${err}`)},
          () => {console.log('complete')})
    }
  }
}
export const fixturePublishHandler = new FixturePublishHandler();

//         .subscribe({
//           onNext: (map: any) => {
//             let {user, fixture, prediction} = map;
//             predictionRepo.insert(prediction)
//               .flatMap(() => {
//                 if(!boards[fixture.season]) {
//                   return boardInfoRepo.updateStatus('compute-started')
//                     .onErrorResumeNext(Rx.Observable.empty())
//                 }
//                 return Rx.Observable.empty()
//               })
//               .flatMap(() => {
//                 let userId = user.id;
//                 let seasonId = fixture.seasonId;
//                 let predictionId = prediction.id;
//                 let predictionScore = prediction.score;
//                 return leaderboardRepo.findOneAndUpdateScore(userId, seasonId, predictionId, predictionScore)
//               })
//           },
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

