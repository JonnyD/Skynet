var config = {};

config.mysql = {};
config.mc = {};
config.settings = {};

config.mysql.host = 'localhost';
config.mysql.database = 'skynet'
config.mysql.user = 'root';
config.mysql.password = '';

config.mc.host = 'mc.civcraft.vg';
config.mc.port = 25565;
config.mc.username = '';
config.mc.password = '';

config.settings.owner = '';
config.settings.antiAfkMessage = 'Hello, I am skynet, this message is to avoid AFK.';
config.settings.verboseLogging = false;

module.exports = config;