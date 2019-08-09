const logger = require("../utils/logger/index")
const Timeseries = require("../models/timeseries");
const File = require("../models/file");

exports.post = (req, res) => {
    logger.info("Controller :: Timeseries :: Request :: Body :: ", req.body.data.length);
    Timeseries.collection.insert(req.body.data)
        .then((data) => {
            return File.findOneAndUpdate({fileName: req.body.fileName}, {
                fileName: req.body.fileName,
                bytesReceived: req.body.bytesReceived
            }, {upsert: true});
        })
        .then((data) => {
            logger.info("Controller :: Timeseries :: insertData :: ", data);
            res.json(data);
        })
        .catch((err) => {
            res.json("");
            logger.error("Controller :: Timeseries :: insertData :: error :: ", err);
        })
};

exports.get = (req, res) => {
    logger.info("Controller :: Timeseries :: Request :: GET");
    Timeseries.find({})
        .sort({'ts': -1})
        .limit(1000)
        .exec()
        .then((data) => {
            res.json(data.map(item => [item.ts, item.val]));
        })
        .catch((err) => {
            res.status(500).send(err);
            logger.error("Controller :: Timeseries :: getData :: error :: ", err);
        })
};
module.exports = exports;