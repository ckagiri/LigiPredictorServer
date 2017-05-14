import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IFixture {
  season: string;
  slug: string;
	date?: any;
  round?: number;
  status: string;
  homeTeam: {
    name: string, 
    slug: string,
    id: string
  };
  awayTeam: {
    name: string,
    slug: string,
    id: string
  };
  api_detail?: any;
};

interface IFixtureModel extends IFixture, mongoose.Document { }

const fixtureSchema = new Schema({
  season: {
    type: Schema.Types.ObjectId,
    ref: 'Season',
		index: true,
		required: true
  },
  slug: {
    type: String, 
    required: true, 
    trim: true
  },
  round: {
    type: Number
  },
 	date: {
		type: Date,
		required: true
	},  
	homeTeam: {
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      index: true,
      required: true
    }
  },
  awayTeam: {
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      index: true,
      required: true
    }
  },
  status: {
    type: String
  },
  result: {
    goalsHomeTeam: {
      type: Number
    },
    goalsAwayTeam: {
      type: Number
    }
  },
  odds: {
    homeWin: {
      type: Number,
      default: 1
    },
    awayWin: {
      type: Number,
      default: 1
    },
    draw: {
      type: Number,
      default: 1
    }
  },
  api_detail: {
    type: Schema.Types.Mixed
  }
});

export const Fixture = mongoose.model<IFixtureModel>('Fixture', fixtureSchema);