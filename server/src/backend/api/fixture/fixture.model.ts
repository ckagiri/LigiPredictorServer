import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IFixture {
  season: string;
  slug: string;
  round?: string;
  status: string;
  homeTeam: {
    name: string, 
    id: string
  };
  awayTeam: {
    name: string,
    id: string
  };
};

interface IFixtureModel extends IFixture, mongoose.Document { }

const fixtureSchema = new Schema({
  season: {
    type: Schema.Types.ObjectId,
    ref: 'Season'
  },
  slug: {
    type: String, 
    required: true, 
    trim: true
  },
  round: {
    type: String
  },
  homeTeam: {
    name: {
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
  }
});

export const Fixture = mongoose.model<IFixtureModel>('Fixture', fixtureSchema);