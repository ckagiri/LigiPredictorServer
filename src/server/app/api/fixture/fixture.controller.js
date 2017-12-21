"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Rx = require("rxjs");
var repositories_1 = require("../../../db/repositories");
var ligi_predictor_1 = require("../../../db/converters/ligi-predictor");
var isMongoId_1 = require("../../utils/isMongoId");
var lzwCompress = require('lzwcompress');
var leagueRepo = new repositories_1.LeagueRepo(new ligi_predictor_1.LeagueConverter());
var seasonRepo = new repositories_1.SeasonRepo(new ligi_predictor_1.SeasonConverter(leagueRepo));
var teamRepo = new repositories_1.TeamRepo(new ligi_predictor_1.TeamConverter());
var fixtureRepo = new repositories_1.FixtureRepo(new ligi_predictor_1.FixtureConverter(seasonRepo, repositories_1.TeamRepo));
var predictionRepo = new repositories_1.PredictionRepo();
var FixtureController = (function () {
    function FixtureController() {
    }
    FixtureController.prototype.show = function (req, res) {
        var id = req.params.id;
        singleFixture(id)
            .subscribe(function (fixture) {
            res.status(200).json(fixture);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    FixtureController.prototype.create = function (req, res) {
        var newFixture = req.body;
        fixtureRepo.insert(req.params.id)
            .subscribe(function (fixture) {
            res.status(201).json(fixture);
        }, function (err) {
            res.status(400).json(err);
        });
    };
    FixtureController.prototype.update = function (req, res) {
        if (req.body._id) {
            delete req.body._id;
        }
        fixtureRepo.getById(req.params.id)
            .flatMap(function (fixture) {
            if (!fixture) {
                res.sendStatus(404);
                return Rx.Observable.throw(Error("bad"));
            }
            return Rx.Observable.of(fixture);
        })
            .flatMap(function (fixture) {
            var updated = _.merge(fixture, req.body);
            return fixtureRepo.updateById({ _id: req.params.id }, updated);
        })
            .subscribe(function (fixture) {
            res.status(200).json(fixture);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    FixtureController.prototype.list = function (req, res) {
        var _a = req.query, leagueSlug = _a.league, seasonSlug = _a.season, matchday = _a.round;
        matchday = matchday && matchday.split('-').pop();
        var user = req['user'];
        var userId = user && user._id;
        var source;
        if (leagueSlug == null && seasonSlug == null) {
            source = seasonRepo.getDefault();
        }
        else {
            source = singleSeason(leagueSlug, seasonSlug);
        }
        source
            .flatMap(function (season) {
            if (!season) {
                res.sendStatus(404);
                return Rx.Observable.throw(Error("bad"));
            }
            return Rx.Observable.of(season);
        })
            .flatMap(function (season) {
            return fixtureRepo.findAllBySeasonRound(season._id, matchday || season.currentRound);
        })
            .flatMap(function (fixtures) {
            return Rx.Observable.from(fixtures);
        })
            .concatMap(function (fixture) {
            if (userId == null) {
                return Rx.Observable.of({
                    fixture: fixture, prediction: { fixture: fixture._id }
                });
            }
            if (fixture.status != 'SCHEDULED' && fixture.status != 'TIMED') {
                return predictionRepo.findOne(userId, fixture._id)
                    .map(function (prediction) {
                    prediction = prediction || { fixture: fixture._id };
                    return {
                        fixture: fixture, prediction: prediction
                    };
                });
            }
            return predictionRepo.findOneOrCreate(userId, fixture)
                .map(function (prediction) {
                return {
                    fixture: fixture, prediction: prediction
                };
            });
        })
            .flatMap(function (map) {
            var fixture = map.fixture, prediction = map.prediction;
            fixture.prediction = prediction;
            return Rx.Observable.of(fixture);
        })
            .toArray()
            .subscribe(function (fixtures) {
            res.status(200).json(fixtures);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    FixtureController.prototype.predictions = function (req, res) {
        var _a = req.query, leagueSlug = _a.league, seasonSlug = _a.season;
        var user = req['user'];
        var userId = user && user._id;
        var source;
        if (leagueSlug == null && seasonSlug == null) {
            source = seasonRepo.getDefault();
        }
        else {
            source = singleSeason(leagueSlug, seasonSlug);
        }
        source
            .flatMap(function (season) {
            if (!season) {
                res.sendStatus(404);
                return Rx.Observable.throw(Error("bad"));
            }
            return Rx.Observable.of(season);
        })
            .flatMap(function (season) {
            return fixtureRepo.findAllBySeason(season._id);
        })
            .flatMap(function (fixtures) {
            return Rx.Observable.from(fixtures);
        })
            .flatMap(function (fixture) {
            if (userId == null) {
                return Rx.Observable.of({
                    fixture: fixture, prediction: null
                });
            }
            return predictionRepo.findOne(userId, fixture._id)
                .map(function (prediction) {
                return {
                    fixture: fixture, prediction: prediction
                };
            });
        })
            .flatMap(function (map) {
            var fixture = map.fixture, prediction = map.prediction;
            fixture.prediction = prediction;
            return Rx.Observable.of(fixture);
        })
            .toArray()
            .subscribe(function (fixtures) {
            var compressed = lzwCompress.pack(fixtures);
            res.status(200).json({ compressed: compressed });
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    FixtureController.prototype.live = function (req, res) {
        var _a = req.query, leagueSlug = _a.league, seasonSlug = _a.season, matchday = _a.round;
        var source;
        if (leagueSlug == null && seasonSlug == null) {
            source = seasonRepo.getDefault();
        }
        else {
            source = singleSeason(leagueSlug, seasonSlug);
        }
        source
            .flatMap(function (season) {
            if (!season) {
                res.sendStatus(404);
                return Rx.Observable.throw(Error("bad"));
            }
            return Rx.Observable.of(season);
        })
            .flatMap(function (season) {
            var round = parseInt(matchday);
            return fixtureRepo.findAllBySeasonRound(season._id, round);
        })
            .flatMap(function (fixtures) {
            return Rx.Observable.from(fixtures);
        })
            .filter(function (fixture) {
            return fixture.status != 'SCHEDULED' && fixture.status != 'TIMED';
        })
            .toArray()
            .subscribe(function (fixtures) {
            res.status(200).json(fixtures);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
    };
    return FixtureController;
}());
exports.FixtureController = FixtureController;
function singleFixture(id) {
    var fixture;
    if (isMongoId_1.default(id)) {
        fixture = fixtureRepo.findOne({ _id: id });
    }
    else {
        fixture = fixtureRepo.findOne({ slug: id });
    }
    return fixture;
}
function singleSeason(leagueId, seasonId) {
    var query;
    query = { $and: [{ 'league.slug': leagueId }, { slug: seasonId }] };
    var season = seasonRepo.findOne(query);
    return season;
}
//# sourceMappingURL=fixture.controller.js.map