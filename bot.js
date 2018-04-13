var Discord = require('discord.io');
var logger = require('winston');
var data = require('./data.json');
var fs = require('fs');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: config.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 7) == '!pandie') {
        var args = message.split(' ');
        var cmd = ""
        if (args.length > 1) {
            cmd = args[1];
        }
        args = args.splice(1);
        switch(cmd) {
            case 'complimentme':
                bot.sendMessage({
                    to: channelID,
                    message: data.compliments[Math.floor(Math.random() * data.compliments.length)]
                });
                break;
            case 'hitme':
                fs.readdir("images/qizai",  function (err, files) {
                    if (err) {
                        logger.error(err);
                    }
                    var file = files[Math.floor(Math.random() * files.length)];
                    bot.uploadFile({
                        to: channelID,
                        file: "images/qizai/" + file,
                        message: 'hit!'
                    });
                })
                break;
            case 'qizai':
                bot.sendMessage({
                    to: channelID,
                    message: 'read more about qizai here: http://www.dailymail.co.uk/news/article-3836388/He-slower-cuter-Meet-world-s-BROWN-panda-Qizai-keeper-reveals-funny-details-bear-s-life.html'
                });
                break;
            default:
                bot.sendMessage({
                    to: channelID,
                    message: 'My current command list:\n\tcomplimentme\n\thitme\n\tqizai\n'
                });
                break;
         }
     }
});