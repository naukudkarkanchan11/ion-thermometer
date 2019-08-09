const mongoose = require("mongoose");
const config = require("config");
const logger = require("../logger/index.js");

mongoose.Promise = require("bluebird");

const connection = mongoose.connect(config.get("database").mongo.url, { useFindAndModify: false , useNewUrlParser: true});
logger.info("db connected ::", config.database.mongo.url);

connection
	.then(db => {
		logger.info(
			`Successfully connected to ${config.get("database").mongo.url} MongoDB cluster in ${
				config.get("env")
			} mode.`,
		);
		return db;
	})
	.catch(err => {
		if (err.message.code === 'ETIMEDOUT') {
			logger.info('Attempting to re-establish database connection.');
			mongoose.connect(config.get("database").url);
		} else {
			logger.error('Error while attempting to connect to database:');
			logger.error(err);
		}
	});

module.exports = connection;
