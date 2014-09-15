var mongoose = require('mongoose');
var Database = function(config) {
mongoose.connect(config.db_url);
require("./models.js");
return mongoose;
}
module.exports = Database;
