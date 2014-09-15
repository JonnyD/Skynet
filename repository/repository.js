module.exports = function(mongoose) {

  var Player = mongoose.model('Player');
  var Event = mongoose.model('Event');
  var Session = mongoose.model('Session');
  var Online = mongoose.model('Online');

  this.findPlayer = function(username, callback) {
    Player.findOrCreate({username: username}, function(err, player, created) {
      if (err) {
        callback(err);
      } else {
        callback(player);
      }
    });
  };

  this.findOnlinePlayers = function(callback) {
    Online.find({}, function(err, onlinePlayers) {
      callback(onlinePlayers);
    });
  };

  this.createOnlinePlayer = function(player, callback) {
    Online.create({ player: player }, function(err, onlinePlayer) {
      callback(onlinePlayer);
    });
  };

  this.removeOnlinePlayer = function(player, callback) {
    Online.findOneAndRemove({ player: player }, function(err, onlinePlayer) {
      callback(onlinePlayer);
    });
  };

  this.createLoginEvent = function(player, callback) {
    Event.create({ player: player, type: 'login' }, function(err, loginEvent) {
      if (err) {

      } else {
        callback(loginEvent);
      }
    });
  };

  this.createLogoutEvent = function(player, callback) {
    Event.create({ player: player, type: 'login' }, function(err, logoutEvent) {
      if (err) {
 
      } else {
        callback(logoutEvent);
      }
    });
  };

  this.startSession = function(loginEvent, player, callback) {
    Session.create({ login: loginEvent, player: player }, function(err, session) {
      if (err) {
  
      } else {
        callback(session);
      }
    });
  };

  this.endSession = function(logoutEvent, player, callback) {
    var query = Session
      .findOne({ player: player, logout: null })
      .sort({'login.date': -1})
      .limit(1);
      
    query.exec(function(err, session) {
      session.logout = logoutEvent;
      session.save();

      callback(session);
    });
 };

}
