const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

const { prefix, token } = require('./config.json');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
});

client.once('ready', () => {
    console.log("Ohayobot online");
});

client.on('message', message => {
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (!client.commands.has(commandName)) return;
    if(message.channel.name == undefined) {
        message.reply("Your commands must be within the server, not through DMs.");
        return;
    }
    else if(message.channel.name != "command-spam" && commandName != "admin") {
        const data = ["To not spam your fellow players, we\'ve restricted commands to the #command-spam channel."];

        message.author.send(data, { split: true });
        message.delete();
        return;
    }

    try {
        command.execute(message, args);
    }
    catch (ex) {
        console.error(ex);
        message.reply('There was an error executing that command');
    }
});

client.login(process.env.BOT_TOKEN);