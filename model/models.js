var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var playerSchema = mongoose.Schema({
  username: String
});
playerSchema.plugin(findOrCreate);
mongoose.model('Player', playerSchema);

var eventSchema = mongoose.Schema({
  player: {type: mongoose.Schema.ObjectId, ref: 'playerSchema'},
  type: String,
  date: {type: Date, default: Date.now}
});
eventSchema.plugin(findOrCreate);
mongoose.model('Event', eventSchema);

var sessionSchema = mongoose.Schema({
  login: {type: mongoose.Schema.ObjectId, ref: 'eventSchema'},
  logout: {type: mongoose.Schema.ObjectId, ref: 'eventSchema', default: null},
  player: {type: mongoose.Schema.ObjectId, ref: 'playerSchema'}
});
sessionSchema.plugin(findOrCreate);
mongoose.model('Session', sessionSchema);

var onlineSchema = mongoose.Schema({
  player: {type: mongoose.Schema.ObjectId, ref: 'playerSchema'},
  date: {type: Date, default: Date.now}
});
onlineSchema.plugin(findOrCreate);
mongoose.model('Online', onlineSchema);
