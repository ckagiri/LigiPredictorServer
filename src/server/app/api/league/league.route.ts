import {Router} from 'express';
import {LeagueController} from './league.controller';
import {SeasonController} from '../season/season.controller'

let router = Router();

class LeagueRouter {
    private controller: LeagueController = new LeagueController();

    get routes () {
        router.get('/', this.controller.list);
				router.get('/:id', this.controller.show)
				router.get('/:leagueId/seasons', this.controller.listSeasons)
				router.get('/:leagueId/seasons/:seasonId', this.controller.showSeason)
				router.get('/:leagueId/seasons/:seasonId/teams', this.controller.listTeams)
				router.get('/:leagueId/seasons/:seasonId/rounds', this.controller.listRounds)
				router.get('/:leagueId/seasons/:seasonId/rounds/:roundId', this.controller.showRound)
				router.get('/:leagueId/seasons/:seasonId/fixtures', this.controller.listFixtures)
				router.get('/:leagueId/seasons/:seasonId/rounds/:roundId/fixtures', this.controller.listFixtures)
        return router;
    }
}

export const leagueRouter = new LeagueRouter();