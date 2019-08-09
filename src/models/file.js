const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const File = new Schema(
    {
        fileName: {
            type: String,
            index: true,
            unique: true,
            required: true
        },
        bytesReceived: {
            type: Number,
            unique: false,
            required: true
        }
    },
    {collection: "file"}
);

module.exports = mongoose.model('File', File);