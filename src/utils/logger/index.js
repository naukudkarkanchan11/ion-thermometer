const config = require("config");

let logger;
let env = config.get("env");
if (env == 'test' || env == 'local' || env == 'development') {
    logger = console;
} else {
    // We will have file logs over here
}

module.exports = logger;
