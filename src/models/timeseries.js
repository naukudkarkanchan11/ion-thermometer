const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimeseriesSchema = new Schema(
    {
        ts: {
            type: Number,
            index: true,
            unique: false,
            required: true
        },
        val: {
            type: Number,
            index: true,
            unique: false,
            required: true
        }
    },
    {collection: "timeseries"}
);

module.exports = mongoose.model('Timeseries', TimeseriesSchema);