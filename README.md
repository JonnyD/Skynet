Skynet
================

## Installation

 * [Install mineflayer] (https://github.com/superjoe30/mineflayer) (`npm install mineflayer`)
 * Install moment (`npm install moment`)
 * Install mysql (`npm install mysql`)
 * Install async (`npm install async`)
 * Create the database using the [following code] (http://sqlfiddle.com/#!2/32e4e9):
 
```sql

CREATE DATABASE IF NOT EXISTS `skynet`;
USE `skynet`;

CREATE TABLE IF NOT EXISTS `event_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `last_login` timestamp,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
);

CREATE TABLE IF NOT EXISTS `event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_type_id` int(4) NOT NULL,
  `player_id` int(32) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_event_type` (`event_type_id`),
  KEY `fk_event_player` (`player_id`)
);

ALTER TABLE `event`
  ADD CONSTRAINT `fk_event_player` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`),
  ADD CONSTRAINT `fk_event_type` FOREIGN KEY (`event_type_id`) REFERENCES `event_type` (`id`);

CREATE TABLE IF NOT EXISTS `session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_id` int(11) NOT NULL,
  `login` int(11) NOT NULL,
  `logout` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `duration` int(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_login_event` (`login`),
  KEY `fk_logout_event` (`logout`),
  KEY `fk_session_player` (`player_id`)
);

ALTER TABLE `session`
  ADD CONSTRAINT `fk_login_event` FOREIGN KEY (`login`) REFERENCES `event` (`id`),
  ADD CONSTRAINT `fk_logout_event` FOREIGN KEY (`logout`) REFERENCES `event` (`id`),
  ADD CONSTRAINT `fk_session_player` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`);
```
* Update Skynet.js with your own MySQL connection settings:
 
```node
 var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'skynet'
});
connection.connect();
```
 
 * Update Skynet.js with your own Minecraft server settings:
 
```node
 var options = {
  host: "mc.civcraft.vg", // optional
  port: 25565,       // optional
  username: "", // email and password are required only for
  password: "",          // online-mode=true servers
};
 ```
* If the server you are connecting to uses the plugin Herochat to manage its chat, overwrite 
 mineflayer/lib/plugins/chat.js with [patch/chat.js] (https://github.com/JonnyD/Skynet/blob/master/patch/chat.js)

Created by [Jonathan Devine](http://jonnydevine.com)
