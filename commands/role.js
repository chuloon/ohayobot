module.exports = {
    name: 'role',
    description: 'Adds a player to a role within a game',
    usage: '<game_name> <role_name>\n game_names = overwatch, league|league-of-legends\noverwatch_roles: dps, tank, support\nleague_roles: top, jungle, mid, adc, support',
    execute(message, args) {
        if(args.length === 2) {
            
            args = args.map((arg) => {
                return arg.toLowerCase();
            });

            if(args[0] == "league") args[0] = "league-of-legends";
            if(!isPlayerRegisteredToGame(args[0], message.member.roles)) {
                const gameRole = getRole(message.guild.roles, args[0]);
                addPlayerToGame(message, gameRole);
            }

            assignPlayerToRole(args, message);
        }
        else {
            message.reply('you\'ve supplied the wrong number of arguments. e.g. !role league mid')
        }
    }
}

isPlayerRegisteredToGame = (role, playerRoles) => {
    return playerRoles.find(roleSet => roleSet.name === role) ? true : false;
}

assignPlayerToRole = (args, message) => {
    const player = message.member;
    if(args[0] == "league-of-legends") args[0] = "league";
    if(eval(args[0] + "Roles").includes(args[1])) {
        player.addRole(getRole(message.guild.roles, args[1], args[0] == "overwatch")).catch(console.error);
        message.reply(`you are now added to the ${args[1]} role`);
    }
    else throwRoleError(message);
}

getRole = (roles, roleName, getSecond = false) => {
    let gameRole;
    console.log(args);

    if(getSecond) {
        gameRole = roles.findAll(role => role.name === roleName);
        console.log(gameRole);
        gameRole = gameRole[1];
    }
    else {
        gameRole = roles.find(role => role.name === roleName);
    }

    return gameRole;
}

throwRoleError = (message) => {
    message.reply("Not a valid role name. For help, type !help role")
}

addPlayerToGame = (message, gameRole) => {
    const player = message.member;

    if(!player.roles.has(gameRole.id)) {
        player.addRole(gameRole).catch(console.error);
        message.reply(`you\'re now playing ${gameRole.name}`)
    }
    else {
        message.reply(`you\'re already playing ${gameRole.name}`)
    }
}


const overwatchRoles = ["dps", "tank", "support"];
const leagueRoles = ["top", "jungle", "mid", "adc", "support"];