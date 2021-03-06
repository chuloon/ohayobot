module.exports = {
    name: 'play',
    description: 'Adds a player to a game',
    usage: '<game_name1> <game_name2> ...\nPossible game names: overwatch, league, tft, csgo',
    execute(message, args) {
        args.forEach((arg) => {
            arg = arg.toLowerCase();
            if(arg == "league") arg = "league-of-legends";
            else if(arg == "tft") arg = "teamfight-tactics";
            else if(arg == "csgo") arg = "counter-strike";
            const gameRole = getRole(message.guild.roles, arg);
            if(!gameRole) throw e;

            addPlayerToRole(message, gameRole);
        });
    }
}

getRole = (roles, gameName) => {
    const gameRole = roles.find(role => role.name === gameName);
    return gameRole;
}

addPlayerToRole = (message, gameRole) => {
    const player = message.member;

    if(!player.roles.has(gameRole.id)) {
        player.addRole(gameRole).catch(console.error);
        message.reply(`you\'re now playing ${gameRole.name}`)
    }
    else {
        message.reply(`you\'re already playing ${gameRole.name}`)
    }
}