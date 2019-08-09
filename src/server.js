const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const logger = require("./utils/logger/index");
const app = express();
logger.info(path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(config.port, err => {
	if (err) {
		logger.error(err);
		process.exit(1);
	}
    require('./utils/db');
    
	fs.readdirSync(path.join(__dirname, "routes")).map(file => {
		require("./routes/" + file)(app);
	});

	logger.info(`API is now running on port ${config.port} in ${config.env} mode`);
});

module.exports = app;
