const logger = require("../utils/logger/index");
const File = require("../models/file");

exports.get = (req, res) => {
    logger.info("Controller :: File :: Request :: Url Path :: ", req.params.fileName);
    File.find({fileName: req.params.fileName})
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err)
        })
};

module.exports = exports;