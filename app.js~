var Database = require('./database.js');
var Repository = require('./repository.js');
var Service = require('./service.js');
var Bot = require('./bot.js');

var config = require('configurizer').getVariables();
var database = new Database(config);
var repository = new Repository(database);
var service = new Service(repository);
var bot = new Bot(config, service);
