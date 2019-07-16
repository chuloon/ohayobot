module.exports = {
    name: 'role',
    description: 'Adds a player to a role within a game',
    usage: '<game_name> <role_name>\n game_names = overwatch, league|league-of-legends\noverwatch_roles: dps, tank, support\nleague_roles: top, jungle, mid, adc, support',
    execute(message, args) {
        if(args.length === 2) {
            if(args[0] == "league") args[0] = "league-of-legends";
            if(isPlayerRegisteredToGame(args[0], message.member.roles)) {
                assignPlayerToRole(args, message);
            }
            else {
                message.reply(`you aren\'t playing ${args[0]} yet. Use the !play command to register for that game first.`)
            }
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
        player.addRole(getRole(message.guild.roles, args[1])).catch(console.error);
        message.reply(`you are now added to the ${args[1]} role`);
    }
    else throwRoleError(message);
}

getRole = (roles, roleName) => {
    const gameRole = roles.find(role => role.name === roleName);
    return gameRole;
}

throwRoleError = (message) => {
    message.reply("Not a valid role name. For help, type !help role")
}


const overwatchRoles = ["dps", "tank", "support"];
const leagueRoles = ["top", "jungle", "mid", "adc", "support"];