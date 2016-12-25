import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IFixture {
    name: string;
    code: string;
    aliases: [string]
};

interface IFixtureModel extends IFixture, mongoose.Document { }

const fixtureSchema = new Schema({
  name: {type: String, required: true, trim: true}
});

export const Fixture = mongoose.model<IFixtureModel>('Fixture', fixtureSchema);