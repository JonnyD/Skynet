var async = require('async');

module.exports = function(repository) {

  this.loginPlayer = function(username, callback) {
    async.waterfall([
      function(callback) {
        repository.findPlayer(username, function(player) {
          callback(null, player);
        });
      },
      function(player, callback) {
        repository.createLoginEvent(player, function(event) {
console.log(event.player.username);
          callback(null, player, event);
        });
      },
      function(player, event, callback) {
        repository.startSession(event, player, function(session) {
          callback(null, player);
        });
      },
      function(player, callback) {
        repository.createOnlinePlayer(player, function(onlinePlayer) {
//console.log("online " + onlinePlayer.player.username);
          callback(null, onlinePlayer);
        });
      }
    ]);
  };

  this.logoutPlayer = function(username, callback) {
    async.waterfall([
      function(callback) {
        repository.findPlayer(username, function(player) {
          callback(null, player);
        });
      },
      function(player, callback) {      
        repository.createLogoutEvent(player, function(event) {
          callback(null, player, event);
        });
      },
      function(player, event, callback) {
        repository.endSession(event, player, function(session) {
          callback(null, player);   
        });
      },
      function(player, callback) {
        repository.removeOnlinePlayer(player, function(onlinePlayer) {
          callback(null, onlinePlayer);
        });
      }
    ]);
  };

  this.logoutAllPlayers = function(callback) {
    var self = this;
    self.getOnlinePlayers(function(onlinePlayers) {
      onlinePlayers.forEach(function(onlinePlayer) {
        var player = onlinePlayer.player;
      console.log(onlinePlayer.username);
        self.logoutPlayer(player.username, function(loggedOutPlayer) {
          
        });
      });
    });
  };

  this.getOnlinePlayers = function(callback) {
    repository.findOnlinePlayers(function(onlinePlayers) {
      callback(onlinePlayers);
    });
  };

}
