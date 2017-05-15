'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var validateSaveTime = function(property) {
	return property > Date.now();
};

/**
 * Prediction Schema
 */
var PredictionSchema = new Schema({
	choice: {
		goalsHomeTeam: {
			type: Number,
			required: 'Home team goals required'
		},
		goalsAwayTeam: {
			type: Number,
			required: 'Away team goals required'
		}
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'User required'
	},
	fixture: {
		type: Number,
		ref: 'Fixture',
		required: 'Fixture required'
	},
	timestamp :{
		type: Date,
		default: Date.now()
	}
});


mongoose.model('Prediction', PredictionSchema);