var assert = require('assert')
  , quoteMeta = require('quotemeta')
  , LEGAL_CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»§'
  , CHAT_LENGTH_LIMIT = 100

module.exports = inject;

var quotedLegalChars = quoteMeta(LEGAL_CHARS);
var incomingFilter = new RegExp("([^" + quotedLegalChars + "]|§.)", 'g');
var outgoingFilter = new RegExp("([^" + quotedLegalChars + "])", 'g');

function inject(bot) {
  bot.client.on(0x03, function(packet) {

    // used by minecraft <= 1.6.1 and craftbukkit >= 1.6.2
    function parseOldMessage(message) {
        console.log("**************************** " + message);
      var legalContent = message.replace(incomingFilter, '');
var front = legalContent.substr(0, legalContent.indexOf(':'));
var content = legalContent.substr(legalContent.indexOf(':')+1);
var frontParts = front.split(' ');

var frontPart1 = frontParts[0];
var frontPart2 = frontParts[1];
if (frontPart1) {
if (typeof frontPart1 != 'undefined' && frontPart1 == 'From' && typeof frontPart2 != 'undefined' && content != 'undefined') {
  bot.emit('whisper', frontPart2, content, message);
} else if (typeof frontPart1 != 'undefined' && typeof frontPart2 === 'undefined' && content != 'undefined') {
  bot.emit('chat', frontPart1, content, message);
}
} else {
  bot.emit('nonSpokenChat', legalContent);
}
    }

    // used by minecraft >= 1.6.2
    function parseJsonMessage(jsonMessage) {
      var username, content;
      if (typeof jsonMsg.translate === 'string' && jsonMsg.translate.match(/^chat\./)) {
        // spoken chat
        username = jsonMsg.using[0];
        content = jsonMsg.using[1].replace(incomingFilter, '');
        bot.emit('chat', username, content, jsonMsg.translate, jsonMsg);
      } else if (jsonMsg.translate === "commands.message.display.incoming") {
        // whispered chat
        username = jsonMsg.using[0];
        content = jsonMsg.using[1].replace(incomingFilter, '');
        bot.emit('whisper', username, content, jsonMsg.translate, jsonMsg);
      } else if (typeof jsonMsg.text === 'string') {
        // craftbukkit message format
        parseOldMessage(jsonMsg.text);
      }
    }

    var jsonMsg;
    try {
      jsonMsg = JSON.parse(packet.message);
    } catch (e) {
      // old message format
      bot.emit('message', packet.message);
      parseOldMessage(packet.message);
      return;
    }
    bot.emit('message', jsonMsg);
    parseJsonMessage(jsonMsg)
  });

  function chatWithHeader(header, message) {
    message = message.replace(outgoingFilter, '');
    var lengthLimit = CHAT_LENGTH_LIMIT - header.length;
    message.split("\n").forEach(function(subMessage) {
      if (! subMessage) return;
      var i, smallMsg;
      for (i = 0; i < subMessage.length; i += lengthLimit) {
        smallMsg = header + subMessage.substring(i, i + lengthLimit);
        bot.client.write(0x03, {message: smallMsg});
      }
    });
  }
  bot.whisper = function(username, message) {
    chatWithHeader("/tell " + username + " ", message);
  };
  bot.chat = function(message) {
    chatWithHeader("", message);
  };
}