var mineflayer = require('mineflayer');
var mysql = require('mysql');
var moment = require('moment');
var async = require('async');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'skynet'
});
connection.connect();

var bot;
var options = {
  host: "mc.civcraft.vg", // optional
  port: 25565,       // optional
  username: "", // email and password are required only for
  password: "",          // online-mode=true server
};
connect();

var antiAfkMessage = 'Hello, I am civplanet.com, this message is to avoid AFK. Type: /ignore civplanet if it gets annoying';
var verboseLogging = true;
var afkTimeout;
var afk1MinuteTimeout;
var afk5MinutesTimeout;
var afk10MinutesTimeout;

function connect() {
try {
  bot = mineflayer.createBot(options);
  bindEvents(bot);
  } catch (e) {
    console.log("error");
  }
}

function bindEvents(bot) {
  bot.on('login', function() {
    console.log("I logged in.");
	startAfkTimeout();
  });
    
  bot.on('playerJoined', function(player) {
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
          updateLastLogin(playerId, timestamp);
          callback(null, playerId, sessionId);
        });
      }
    ]);
  });
    
  bot.on('playerLeft', function(player) {
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
  });
    
  bot.on('whisper', function(username, message, rawMessage) {
    console.log("message", message, "rawMessage", rawMessage, "username", username);
    if (username === "Gu3rr1lla") {
      if (message === " quit") {
        clearTimeouts();
        bot.quit();
        console.log("logging out all players");
        setTimeout(function () {
            try {
          logoutAllPlayers(getTimestamp(), function(finished) {
            console.log("logged out all players " + finished);
          });
          } catch (er) {
            console.log("er");   
          }
        }, 30 * 1000);
      }
      if (message === " restart") {
        
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
            bot.chat(antiAfkMessage);
        } else if (message.indexOf('1 minute') >= 0) {
          afk1MinuteTimeout = setTimeout(function () {
            bot.chat(antiAfkMessage);
          }, 30 * 1000);
        } else if (message.indexOf('5 minutes') >= 0) {
          afk5MinutesTimeout = setTimeout(function () {
            bot.chat(antiAfkMessage);
          }, 60 * 1000);
        } else if (message.indexOf('10 minutes') >= 0) {
          afk10MinutesTimeout = setTimeout(function () {
            bot.chat(antiAfkMessage);
          }, 120 * 1000);
        } else {
          bot.chat(antiAfkMessage);
        }
    }
  });
 
  bot.on('kicked', function(reason) {
    console.log("I got kicked for", reason, "lol");
          clearTimeouts();
	
	var timestamp = getTimestamp();
      async.series([
        function(callback) {
		  
          console.log("logging out all players");
        setTimeout(function () {
            logoutAllPlayers(timestamp, function(finished) {
              console.log("logged out all players " + finished);
              callback();
            });
			}, 30 * 1000);
        },
        function(callback) {
		  //connect();
		  callback();
        }
      ]);
  });

  bot.on('spawn', function() {      
    console.log("I spawned");
  });
    
  bot.on('death', function() {
    console.log("I died x.x.");
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
console.log("err " + err);
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
      //logVerbose("[" + getTimestamp() + "] " + "Found player: " + username + " (" + playerId + ")");
      playerId = rows[0].id;
    }
    callback(playerId);
  });
}
    
function findOnlinePlayers(callback) {
console.log("hello");
  connection.query('SELECT * FROM session s, player p WHERE p.id = s.player_id AND logout IS NULL', function(error, rows, fields) {
    if (rows.length > 0) {
      callback(rows);
    }
  });
}
    
function logoutAllPlayers(timestamp, callback) {
console.log("logout");
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
                console.log("sessionId " + sessionId);
              //console.log("[" + timestamp + "] Ended session: " + sessionId + " for " + username + " (" + playerId + ")");	 
              console.log("affected rows " + finished);
              callback(null, finished);
			}); 		
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
    
function updateLastLogin(playerId, timestamp) {
  connection.query("UPDATE player SET last_login = '" + timestamp + "' WHERE id = " + playerId);
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
  clearTimeout(afkTimeout);
  clearTimeout(afk1MinuteTimeout);
  clearTimeout(afk5MinutesTimeout);
  clearTimeout(afk10MinutesTimeout);
}

var start;
var nextAt;
function startAfkTimeout() {
  if (!start) {
    start = new Date().getTime();
    nextAt = start;
  }
  nextAt += 30 * 1000;
    
  bot.setControlState('jump', true);
  bot.setControlState('jump', false);
  console.log("[" + getTimestamp() + "] jumped");
    
  afkTimeout = setTimeout(startAfkTimeout, nextAt - new Date().getTime());
}

function logVerbose(message) {
  if (verboseLogging) {
    console.log(message);
  }  
}
