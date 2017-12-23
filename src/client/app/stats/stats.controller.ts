namespace app.stats {
  'use strict';

  export class StatsController {
    static $inject: string[] = ['$q', '$window', 'localstorage', 'logger', 'leagueSeasonFactory', 'fixturePredictionService'];

    constructor(private $q: ng.IQService,
      private $window: ng.IWindowService,
      private storage: app.core.ILocalStorageService,
      private logger: blocks.logger.Logger,
      private leagueSeasonFactory: any,
      private fixturePredictionService: app.core.IFixturePredictionService) {
      this.activate();
    }

    title: string = 'Stats';

    compressed: any;
    fixtures: [any];
    private COLORS = ['#1f77b4','#d62728'];
    private BAR_CHART_OPTIONS = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: 250,
        x: function (d: any) { return d.label; },
        y: function (d: any) { return d.value; },
        showValues: true,
        showControls: false,
        duration: 500,
        xAxis: {
          showMaxMin: false
        },
        yAxis: {
          axisLabel: 'Values'
        }
      }
    };
    allMatchOutcome: any = {};
    matchOutcomeInTeamMatches: any = {};
    pointsInTeamMatches: any;
    pointsByPoint: any;
    goalDiffByGd: any;
    SERVER_REFRESHED: boolean = false;
    
    activate() {
      let compressed = this.storage.getItem('compressed-fixtures');
      if(compressed != null) {
        this.localRefresh(compressed);
      } else {
        this.serverRefresh()
      }
    }

    serverRefresh() {
      this.fixturePredictionService.getFixturesWithPredictions()
        .then((data) => {
          let compressed = data.compressed;
          this.storage.setItem('compressed-fixtures', compressed);
          this.SERVER_REFRESHED = true;
          this.localRefresh(compressed)     
        })
    }

    localRefresh(compressed: any) {
      this.fixtures = this.$window.lzwCompress.unpack(compressed);
      let closestMatchDate = this.leagueSeasonFactory.closestMatchDate(this.fixtures);
      let moment = this.$window.moment;
      let now = moment();
      const closestTime = moment(closestMatchDate);
      const diff = Math.abs(closestTime.diff(now, 'minutes'));
      if(diff < 60 && !this.SERVER_REFRESHED) {
        this.serverRefresh();
      }
      this.loadAllMatchOutcomeChart()
      this.loadMatchOutcomeInTeamMatchesChart();
    }

    loadAllMatchOutcomeChart() {
        let options:any = angular.copy(this.BAR_CHART_OPTIONS);
        let chart: any = options.chart;
        chart.barColor = ['#d62728', '#1f77b4']
        chart.yAxis = {
          axisLabel: 'Matches',
          tickFormat: (d: any) => {
              return this.$window.d3.format('d')(d);
          }
        }
        chart.valueFormat = (d: any) => {
          return this.$window.d3.format('d')(d)
        }
        this.allMatchOutcome.options = options;
        this.allMatchOutcome.data = [];
        let acc: any = {correct: 0, incorrect: 0};
        this.fixtures.reduce((acc, fixture) => {
          let prediction = fixture.prediction;
          if(prediction == null || prediction.points == null) {return acc;}
          let result = fixture.result;
          let choice = prediction.choice;
          let choiceOutcome = calcOutcome(choice.goalsHomeTeam, choice.goalsAwayTeam);
          let resultOutcome = calcOutcome(result.goalsHomeTeam, result.goalsAwayTeam);
          if(choiceOutcome == resultOutcome) {
            acc['correct'] += 1
          } else {
            acc['incorrect'] += 1;
          }
          return acc;
        }, acc);
        let values = [];
        for (let key in acc) {
          values.push({label: key, value: acc[key]});
        }
        this.allMatchOutcome.data.push({key: 'Match-Outcome', values})
    }

    loadMatchOutcomeInTeamMatchesChart() {
      let options:any = angular.copy(this.BAR_CHART_OPTIONS);
      let chart: any = options.chart;
      chart.height = 650;
      chart.yAxis = {
        axisLabel: 'Matches',
        tickFormat: (d: any) => {
            return this.$window.d3.format('d')(d);
        }
      };
      chart.valueFormat = (d: any) => {
        return this.$window.d3.format('d')(d)
      }
      chart.margin = {"left":100};
      this.matchOutcomeInTeamMatches.options = options;
      this.matchOutcomeInTeamMatches.data = [];
      let acc: any = {correct: {}, incorrect: {}};
      this.fixtures.reduce((acc, fixture) => {
        let prediction = fixture.prediction;
        if(prediction == null || prediction.points == null) {return acc;}

        let result = fixture.result;
        let choice = prediction.choice;
        let homeTeam = fixture.homeTeam.name;
        let awayTeam = fixture.awayTeam.name;
        acc['correct'][homeTeam] = acc['correct'][homeTeam] || 0;
        acc['correct'][awayTeam] = acc['correct'][awayTeam] || 0;
        acc['incorrect'][homeTeam] = acc['incorrect'][homeTeam] || 0;
        acc['incorrect'][awayTeam] = acc['incorrect'][awayTeam] || 0;
        let choiceOutcome = calcOutcome(choice.goalsHomeTeam, choice.goalsAwayTeam);
        let resultOutcome = calcOutcome(result.goalsHomeTeam, result.goalsAwayTeam);
        if(choiceOutcome == resultOutcome) {
          acc['correct'][homeTeam] += 1;
          acc['correct'][awayTeam] += 1;
        } else {
          acc['incorrect'][homeTeam] += 1;
          acc['incorrect'][awayTeam] += 1;
        }
        return acc;
      }, acc);
      let chartData:any = [];
      for (let key in acc) {
        let values = [];
        for(let key1 in acc[key]) {
          values.push({label: key1, value: acc[key][key1]});
        }
        values.sort((a: any, b: any) => {
          return b.value - a.value;
        })
        chartData.push({key, values})
      }
      chartData[1].color = "#d62728";
      chartData[0].color = "#1f77b4";
      this.matchOutcomeInTeamMatches.data = chartData;
    }
  }

  function calcOutcome(home: number, away: number): string {
    if(home > away){
      return 'w';
    }
    if(home < away){
      return 'l';
    }
    if(home === away){
      return 'd';
    }
  }

  angular
    .module('app.stats')
    .controller('StatsController', StatsController);
}