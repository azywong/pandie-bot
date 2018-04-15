var Discord = require('discord.io');
var data = require('./data.json');
var fs = require('fs');
var express = require('express');


var app = express();
var port = process.env.PORT || 5000;

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/static'));

// Initialize Discord Bot
var bot = new Discord.Client({
   token: process.env.token,
   autorun: true
});

bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
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
            case 'compliment':
                if (args.length == 2) {
                    bot.sendMessage({
                        to: channelID,
                        message: args[1] + " " + data.compliments[Math.floor(Math.random() * data.compliments.length)]
                    });
                } else {
                   bot.sendMessage({
                        to: channelID,
                        message: 'I was confused! \n  Usage is !pandie compliment <user>'
                    });
                }
                break;
            case 'hitme':
                fs.readdir("images/qizai",  function (err, files) {
                    if (err) {
                        console.log(err);
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
                var message = "My current command list:";
                for (var i = 0; i < data.commands.length; i++) {
                    message += "\n\t" + data.commands[i];
                };
                bot.sendMessage({
                    to: channelID,
                    message: message
                });
                break;
         }
     }
});

app.get('/', function(req, res) {
    res.render('index', { title: 'pandie-bot', commands: data.commands })
});
app.listen(port);