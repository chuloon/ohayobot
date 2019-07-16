const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

const { prefix, token } = require('./config.json');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const embedMessage = new Discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle('Some title')
    .setURL('https://discord.js.org/')
    .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
    .setDescription('Some description here')
    .setThumbnail('https://i.imgur.com/wSTFkRM.png')
    .addField('Regular field title', 'Some value here')
    .addBlankField()
    .addField('Inline field title', 'Some value here', true)
    .addField('Inline field title', 'Some value here', true)
    .addField('Inline field title', 'Some value here', true)
    .setImage('https://i.imgur.com/wSTFkRM.png')
    .setTimestamp()
    .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

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

    try {
        command.execute(message, args);
    }
    catch (ex) {
        console.error(ex);
        message.reply('There was an error executing that command');
    }
});

client.on('guildMemberAdd', (member) => {
    member.send([
        "Welcome to the Ohayocon Gaming Tournament Realm!",
        "You can find a more detailed explanation in **!help**, but here's a quick rundown of how to use this server",
        "Begin by telling me what games you play with **!play <game_name>**",
        "Tell me what role in a game you play with **!role <game_name> <role_name>**",
        "To register for a team in a tournament, type **!team <team_key>**. Remember, this key is secret and shouldn't be spread outside of your team. Doing so could risk others joining your team comms!"
    ], { split: true });
});

client.login(process.env.BOT_TOKEN);