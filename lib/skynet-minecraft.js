var mineflayer = require('mineflayer');
var mysql = require('mysql');
var moment = require('moment');
var async = require('async');
var config = require('./config')

var connection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
});
connection.connect();

var bot;
var options = {
  host: config.mc.host,
  port: config.mc.port,
  username: config.mc.username,
  password: config.mc.password
};
startConnectionTimeout();

process.on('uncaughtException', function(exception) {
  console.log("caught exception " + exception);
});

var connected = false;
var connectionTimeout;
var afkTimeout;
var afk1MinuteTimeout;
var afk5MinutesTimeout;
var afk10MinutesTimeout;

function connect() {
  console.log("[" + getTimestamp() + "] Attempting to login");
  bot = mineflayer.createBot(options);
  bot.on('connect', function() {
    bindEvents(bot);
    connected = true;
    stopConnectionTimeout();
  });
}

function bindEvents(bot) {
  console.log("[" + getTimestamp() + "] Binding Events");

  bot.on('login', function() {
    console.log("[" + getTimestamp() + "] I logged in.");
  });

  bot.on('playerJoined', function(player) {
    loginPlayer(player);
  });

  bot.on('playerLeft', function(player) {
    logoutPlayer(player);
  });

  bot.on('whisper', function(username, message, rawMessage) {
    console.log("message", message, "rawMessage", rawMessage, "username", username);
    if (username === config.settings.owner) {
      if (message === " quit" || message === " restart") {
        connected = false;
        var timestamp = getTimestamp();
        clearTimeouts();
        async.series([
          function(callback) {
            bot.quit();
            console.log("logging out all players");
            setTimeout(function () {
              logoutAllPlayers(timestamp, function(finished) {
                console.log("logged out all players " + finished);
                callback();
              });
            }, 30 * 1000);
          },
          function(callback) {
            if (message === " restart") {
              callback();
            }
          }
        ]);
      }
    }
  });

  bot.on('chat', function(username, message) {
    console.log("chat " + username + " " + message);
  });

  bot.on('nonSpokenChat', function(message) {
    console.log("nonSpokenChat " + message);
    if (message.indexOf('AFK Plugin') >= 0) {
      if (message.indexOf('10 seconds') >= 0) {
        bot.chat(config.settings.antiAfkMessage);
      } else if (message.indexOf('1 minute') >= 0) {
        afk1MinuteTimeout = setTimeout(function () {
          bot.chat(config.settings.antiAfkMessage);
        }, 30 * 1000);
      } else if (message.indexOf('5 minutes') >= 0) {
        afk5MinutesTimeout = setTimeout(function () {
          bot.chat(config.settings.antiAfkMessage);
        }, 60 * 1000);
      } else if (message.indexOf('10 minutes') >= 0) {
        afk10MinutesTimeout = setTimeout(function () {
          bot.chat(config.settings.antiAfkMessage);
        }, 120 * 1000);
      } else {
        bot.chat(config.settings.antiAfkMessage);
      }
    }
  });

  bot.on('kicked', function(reason) {
    connected = false;
    stopConnectionTimeout();
    var timestamp = getTimestamp();
    console.log("[" + timestamp + "] I got kicked for", reason, "lol");
    clearTimeouts();
    async.series([
      function(callback) {
        console.log("[" + timestamp + "] Logging out all players");
        setTimeout(function () {
          logoutAllPlayers(timestamp, function(finished) {
            console.log("[" + timestamp + "] Logged out all players " + finished);
            callback();
          });
        }, 30 * 1000);
      },
      function(callback) {
        startConnectionTimeout();
        callback();
      }
    ]);
  });

  bot.on('spawn', function() {
    console.log("[" + getTimestamp() + "] I spawned");
    startAfkTimeout();
  });

  bot.on('death', function() {
    console.log("[" + getTimestamp() + "] I died x.x.");
  });
}

function getPlayer(username, timestamp, callback) {
  findPlayer(username, function(playerId) {
    if (typeof playerId === 'undefined') {
      createPlayer(username, timestamp, function(playerId) {
        callback(playerId);
      });
    } else {
      callback(playerId);
    }
  });
}

function addEvent(playerId, type, timestamp, callback) {
  var event = {player_id: playerId, event_type_id: type, timestamp: timestamp};
  connection.query('INSERT INTO event SET ?', event, function(err, result) {
    callback(result.insertId);
  });
}

function findEventTimestamp(eventId, callback) {
  connection.query('SELECT timestamp AS timestamp FROM event WHERE id = ' + eventId, function(err, rows, fields) {
    if (rows.length > 0) {
      callback(rows[0].timestamp);
    }
  });
}

function addSession(username, playerId, timestamp, loginEventId, callback) {
  var session = { player_id: playerId, login: loginEventId, login_timestamp: timestamp };
  connection.query('INSERT INTO session SET ?', session, function(err, result) {
    logVerbose("[" + getTimestamp() + "] Attempting to start session for " + username + " with eventId " + loginEventId);
    callback(result.insertId);
  });
}

function updateSession(sessionId, logoutEventId, logoutTimestamp, duration, callback) {
  connection.query("UPDATE session SET logout = ?, duration = ?, logout_timestamp = ? WHERE id = ?", [logoutEventId, duration, logoutTimestamp, sessionId], function(err, result) {
    callback(1);
  });
}

function findSession(playerId, callback) {
  connection.query('SELECT id AS session_id, login AS loginEvent FROM session WHERE player_id = ? AND logout IS NULL ORDER BY login_timestamp ASC LIMIT 1', [playerId], function(err, rows, fields) {
    if (rows.length > 0) {
      callback(rows[0].session_id, rows[0].loginEvent);
    }
  });
}

function findPlayer(username, callback) {
  connection.query('SELECT id from player where username = ?', [username], function(err, rows, fields) {
    var playerId;
    if (rows.length > 0) {
      playerId = rows[0].id;
    }
    callback(playerId);
  });
}

function findOnlinePlayers(callback) {
  connection.query('SELECT * FROM session s, player p WHERE p.id = s.player_id AND logout IS NULL', function(error, rows, fields) {
    if (rows.length > 0) {
      callback(rows);
    }
  });
}

function logoutAllPlayers(timestamp, callback) {
  var counter = 0;
  findOnlinePlayers(function(sessions) {
    logVerbose("[" + timestamp + "] Sessions found: " + sessions.length);
    if (sessions.length > 0) {
      sessions.forEach(function(session) {
        var playerId = session.player_id;
        var username = session.username;

        async.waterfall([
          function(callback) {
            addEvent(playerId, 2, timestamp, function(logoutEventId) {
              logVerbose("[" + timestamp + "] " + "Created logout: " + logoutEventId + " for " + username + " (" + playerId +")");
              callback(null, logoutEventId);
            });
          },
          function(logoutEventId, callback) {
            findSession(playerId, function(sessionId, loginEventId) {
              logVerbose("[" + timestamp + "] " + "Found session: " + sessionId +" for " + username + " (" + playerId +")");
              callback(null, sessionId, loginEventId, logoutEventId);
            });
          },
          function(sessionId, loginEventId, logoutEventId, callback) {
            findEventTimestamp(loginEventId, function(loginTimestamp) {
              findEventTimestamp(logoutEventId, function(logoutTimestamp) {
                var difference = diffBetweenTimestamps(loginTimestamp, logoutTimestamp);
                logVerbose("[" + timestamp + "] " + "Duration: " + difference + " for " + username);
                callback(null, sessionId, logoutEventId, difference);
              });
            });
          },
          function(sessionId, logoutEventId, difference, callback) {
            updateSession(sessionId, logoutEventId, timestamp, difference, function(finished) {
              logVerbose("[" + timestamp + "] Ended session: " + sessionId + " for " + username + " (" + playerId + ")");
              callback(null, finished);
            });1
          }
        ], function(err, result) {
          counter = counter + 1;
          if (counter === sessions.length) {
            callback(1);
          }
        });
      });
    }
  });
}

function createPlayer(username, timestamp, callback) {
  var newPlayer  = {username: username, timestamp: timestamp};
  connection.query('INSERT INTO player SET ?', newPlayer, function(err, result) {
    var playerId;
    playerId = result.insertId;
    logVerbose("[" + timestamp + "] " + "Created player: " + username + " (" + playerId + ")");
    callback(playerId);
  });
}

function loginPlayer(player) {
  var timestamp = getTimestamp();
  console.log("[" + timestamp + "] " + player.username + " joined");
  var username = player.username;
  async.waterfall([
    function(callback) {
      getPlayer(username, timestamp, function(playerId) {
        callback(null, playerId);
      });
    },
    function(playerId, callback) {
      addEvent(playerId, 1, timestamp, function(eventId) {
        logVerbose("[" + timestamp + "] " + "Created login: " + eventId + " for " + player.username + " (" + playerId +")");
        callback(null, playerId, eventId);
      });
    },
    function(playerId, eventId, callback) {
      addSession(player.username, playerId, timestamp, eventId, function(sessionId) {
        logVerbose("[" + timestamp + "] Started session: " + sessionId + " for " + player.username + " (" + playerId +")");
        callback(null, playerId, sessionId);
      });
    }
  ]);
}

function logoutPlayer(player) {
  var timestamp = getTimestamp();
  console.log("[" + timestamp + "] " + player.username + " left");

  var username = player.username;
  async.waterfall([
    function(callback) {
      findPlayer(username, function(playerId) {
        callback(null, playerId);
      });
    },
    function(playerId, callback) {
      addEvent(playerId, 2, timestamp, function(logoutEventId) {
        logVerbose("[" + timestamp + "] " + "Created logout: " + logoutEventId + " for " + username + " (" + playerId +")");
        callback(null, playerId, logoutEventId);
      });
    },
    function(playerId, logoutEventId, callback) {
      findSession(playerId, function(sessionId, loginEventId) {
        logVerbose("[" + timestamp + "] " + "Found session: " + sessionId +" for " + username + " (" + playerId +")");
        callback(null, playerId, sessionId, loginEventId, logoutEventId);
      });
    },
    function(playerId, sessionId, loginEventId, logoutEventId, callback) {
      findEventTimestamp(loginEventId, function(loginTimestamp) {
        findEventTimestamp(logoutEventId, function(logoutTimestamp) {
          var difference = diffBetweenTimestamps(loginTimestamp, logoutTimestamp);
          logVerbose("[" + timestamp + "] " + "Duration: " + difference + " for " + username);
          callback(null, playerId, sessionId, logoutEventId, difference);
        });
      });
    },
    function(playerId, sessionId, logoutEventId, difference, callback) {
      updateSession(sessionId, logoutEventId, timestamp, difference, function(updated) {
        logVerbose("[" + timestamp + "] " + "Ended session: " + sessionId + " for " + username + " (" + playerId +")");
      });
    }
  ]);
}

function getTimestamp() {
  var MyDate = new Date();
  var MyDateString;
  MyDateString = MyDate.getFullYear() + "-"
    + ('0' + (MyDate.getMonth()+1)).slice(-2) + "-"
    + ('0' + MyDate.getDate()).slice(-2) + " "
    + ('0' + MyDate.getHours()).slice(-2) + ":"
    + ('0' + MyDate.getMinutes()).slice(-2) + ":"
    + ('0' + MyDate.getSeconds()).slice(-2);
  return MyDateString;
}

function parseTimestamp(input) {
  var timestamp = input.split(" ");
  var date = timestamp[0];
  var time = timestamp[1];
  var dateParts = date.split("-");
  var timeParts = time.split(":");
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return moment([dateParts[0], dateParts[1]-1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]]);
}

function diffBetweenTimestamps(timestamp1, timestamp2) {
  var timestamp1Parsed = moment(timestamp1);
  var timestamp2Parsed = moment(timestamp2);
  var difference = timestamp2Parsed.diff(timestamp1Parsed, 'seconds');
  return difference;
}

function clearTimeouts() {
  stopAfkTimeout();
  clearTimeout(afk1MinuteTimeout);
  clearTimeout(afk5MinutesTimeout);
  clearTimeout(afk10MinutesTimeout);
}

var startAfk;
var nextAtAfk;
function startAfkTimeout() {
  if (!startAfk) {
    startAfk = new Date().getTime();
    nextAtAfk = startAfk;
  }
  nextAtAfk += 30 * 1000;

  if (connected) {
    bot.setControlState('jump', true);
    bot.setControlState('jump', false);
    console.log("[" + getTimestamp() + "] I jumped");

    afkTimeout = setTimeout(startAfkTimeout, nextAtAfk - new Date().getTime());
  }
}

function stopAfkTimeout() {
  startAfk = null;
  nextAtAfk = null;
  clearTimeout(afkTimeout);
}

var startConnection;
var nextAtConnection;
function startConnectionTimeout() {
  if (!startConnection) {
    startConnection = new Date().getTime();
    nextAtConnection = startConnection;
  }
  nextAtConnection += 10 * 1000;

  if (!connected) {
    connect();

    afkTimeout = setTimeout(startConnectionTimeout, nextAtConnection - new Date().getTime());
  }
}

function stopConnectionTimeout() {
  startConnection = null;
  nextAtConnection = null;
  clearTimeout(connectionTimeout);
}

function logVerbose(message) {
  if (config.settings.verboseLogging) {
    console.log(message);
  }
}
