const File = require("../controllers/file")
module.exports = api => {
    api.route('/file/:fileName').get(File.get);
};