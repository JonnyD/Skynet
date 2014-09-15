var readline = require('readline');
var color = require("ansi-color").set;
var mc = require('minecraft-protocol');
var states = mc.protocol.states;
var util = require('util');

module.exports = function Bot(options, service) {

var colors = new Array();
colors["black"] = 'black+white_bg';
colors["dark_blue"] = 'blue';
colors["dark_green"] = 'green';
colors["dark_aqua"] = 'cyan'
colors["dark_red"] = 'red'
colors["dark_purple"] = 'magenta'
colors["gold"] = 'yellow'
colors["gray"] = 'black+white_bg'
colors["dark_gray"] = 'black+white_bg'
colors["blue"] = 'blue'
colors["green"] = 'green'
colors["aqua"] = 'cyan'
colors["red"] = 'red'
colors["light_purple"] = 'magenta'
colors["yellow"] = 'yellow'
colors["white"] = 'white'
colors["obfuscated"] = 'blink'
colors["bold"] = 'bold'
colors["strikethrough"] = ''
colors["underlined"] = 'underlined'
colors["italic"] = ''
colors["reset"] = 'white+black_bg'

var dictionary = {};
dictionary["chat.stream.emote"] = "(%s) * %s %s";
dictionary["chat.stream.text"] = "(%s) <%s> %s";
dictionary["chat.type.achievement"] = "%s has just earned the achievement %s";
dictionary["chat.type.admin"] = "[%s: %s]";
dictionary["chat.type.announcement"] = "[%s] %s";
dictionary["chat.type.emote"] = "* %s %s";
dictionary["chat.type.text"] = "<%s> %s";

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
 
var client = mc.createClient({
    host: options.host,
    port: options.port,
    username: options.username,
    password: options.password
});

client.on([states.PLAY, 0x40], function(packet) {
    console.info(color('Kicked for ' + packet.reason, "blink+red"));
    service.logoutAllPlayers();
    //process.exit(1);
});
 
 var chats = [];
 
client.on('connect', function() {
    console.info(color('Successfully connected to ' + options.host + ':' + options.port, "blink+green"));
});

client.on('state', function(newState) {
  if (newState === states.PLAY) {
    chats.forEach(function(chat) {
      client.write('chat', {message: chat});
    });
  }
})
 
rl.on('line', function(line) {
    if(line == '') {
        return; 
    } else if(line == '/quit') {
        var reason = 'disconnect.quitting';
        console.info('Disconnected from ' + options.host + ':' + options.port);
        client.write([states.PLAY, 0x40], { reason: reason });	
        return;
    } else if(line == '/end') {
        console.info('Forcibly ended client');
        process.exit(0);
        return;
    }
    if (!client.write([states.PLAY, 0x01], { message: line })) {
      chats.push(line);
    }
});
 
client.on('chat', function(packet) {
    var j = JSON.parse(packet.message);
    var chat = parseChat(j, {});
    console.info(chat);
});

function parseChat(chatObj, parentState) {
  function getColorize(parentState) {
    var myColor = "";
    if ('color' in parentState) myColor += colors[parentState.color] + "+";
    if (parentState.bold) myColor += "bold+";
    if (parentState.underlined) myColor += "underline+";
    if (parentState.obfuscated) myColor += "obfuscated+";
    if (myColor.length > 0) myColor = myColor.slice(0,-1);
    return myColor;
  }
  if (typeof chatObj === "string") {
    return color(chatObj, getColorize(parentState));
  } else {
    var chat = "";
    if ('color' in chatObj) parentState.color = chatObj['color'];
    if ('bold' in chatObj) parentState.bold = chatObj['bold'];
    if ('italic' in chatObj) parentState.italic = chatObj['italic'];
    if ('underlined' in chatObj) parentState.underlined = chatObj['underlined'];
    if ('strikethrough' in chatObj) parentState.strikethrough = chatObj['strikethrough'];
    if ('obfuscated' in chatObj) parentState.obfuscated = chatObj['obfuscated'];

    if ('text' in chatObj) {
      chat += color(chatObj.text, getColorize(parentState));
    } else if ('translate' in chatObj && dictionary.hasOwnProperty(chatObj.translate)) {
      var args = [dictionary[chatObj.translate]];
      chatObj['with'].forEach(function(s) {
        args.push(parseChat(s, parentState));
      });

      chat += color(util.format.apply(this, args), getColorize(parentState));
    }
    for (var i in chatObj.extra) {
      chat += parseChat(chatObj.extra[i], parentState);
    }
    return chat;
  }
}

client.players = {};
client.on([states.PLAY, 0x38], function(packet) {
  var player = client.players[packet.playerName];
  
  if(packet.online) {
    if(! player) {
      player = {
        ping: packet.ping,
        username: packet.playerName
      };
      client.players[player.username] = player;
      console.log("player joined " + player.username);
      service.loginPlayer(player.username);
    }
  } else {
    if(player) {
      delete client.players[player.username];
      console.log("player left " + player.username);
      service.logoutPlayer(player.username);
    }
  }
});

client.on([states.PLAY, 0x01], function(packet) {
  console.log("logged in ");
});

}
