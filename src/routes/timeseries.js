const Timeseries =  require("../controllers/timeseries");

module.exports = api => {
    api.route('/timeseries/').post(Timeseries.post);
    api.route('/timeseries/').get(Timeseries.get);
};