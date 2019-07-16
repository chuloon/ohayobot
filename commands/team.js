module.exports = {
    name: 'team',
    description: 'Adds a player to a team',
    usage: '<team_id>',
    execute(message, args) {
        if(args.length != 1) {
            message.reply('that\'s the wrong number of arguments. Use !help team for further details.');
            return;
        }
        else {
            args[0] = encryptTeamId(args[0]);
        }

        if(teamRoleExists(message.guild.roles, args[0])) {
            addPlayerToTeam(message, args);
        }
        else {
            teamCreationProcess(message, args[0]);
        }
    }
}

encryptTeamId = (teamId) => {
    const encryptedTeamId = Math.floor((teamId + 400) / 100 * 125) + 2;
    return encryptedTeamId;
}

createVoiceTextChannels = (message, teamId, teamRole) => {
    createChannel(message, teamId, "text", teamRole);
    createChannel(message, teamId, "voice", teamRole);
}

createChannel = (message, teamId, type, teamRole) => {
    const everyoneRole = getRole(message.guild.roles, "@everyone");

    message.guild.createChannel("team-" + teamId, type).then((channel) => {
        channel.overwritePermissions(everyoneRole, {
            VIEW_CHANNEL: false
        });

        channel.overwritePermissions(teamRole, {
            VIEW_CHANNEL: true
        });

        addChannelToCategory(message, channel);
    });
}

addChannelToCategory = (message, channel) => {
    const category = message.guild.channels.find(c => c.name == "Team Chat" && c.type == "category");
    message.guild.channels.forEach(channel => {
        console.log(channel.name);
    });
    if(category && channel) channel.setParent(category);
}

teamCreationProcess = (message, teamId) => {
    const roleData = {
        name: "team-" + teamId,
        color: '#FFCC00',
        mentionable: true,
    };

    message.guild.createRole(roleData).then((role) => {
        addPlayerToTeam(message, teamId);
        createVoiceTextChannels(message, teamId, role);
    });
}

addPlayerToTeam = (message, teamId) => {
    const teamRole = getRole(message.guild.roles, "team-" + teamId);
    message.member.addRole(teamRole).catch(console.error);
    message.reply("I've added you to your team!");
    message.delete();
}

getRole = (roles, roleName) => {
    const gameRole = roles.find(role => role.name === roleName);
    return gameRole;
}

teamRoleExists = (roles, roleName) => {
    return roles.find(x => x.name == "team-" + roleName) != null ? true : false;
}