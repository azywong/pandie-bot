var Discord = require('discord.io');
var data = require('./data.json');
var fs = require('fs');
var express = require('express');


var app = express();
var port = process.env.PORT || 5000;

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
                bot.sendMessage({
                    to: channelID,
                    message: 'My current command list:\n\tcomplimentme\n\thitme\n\tqizai\n'
                });
                break;
         }
     }
});

app.get('/', function(req, res) {
    res.send('<h1>hello. i am a discord pandie-bot</h1><p><a href="https://discordapp.com/oauth2/authorize?&client_id=434474046860689428&scope=bot&permissions=0">add pandie bot!</a></p><blockquote>!pandie <p> complimentme <br> hitme <br> qizai</p></blockquote>')
});
app.listen(port);