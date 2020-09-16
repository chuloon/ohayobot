module.exports = {
    name: 'admin',
    description: 'Admin controls to delete teams. If you need to use this help command, you probably can\'t use it anyway. kthxbye',
    usage: 'delete <team_name> | create',
    execute(message, args) {
        if(!message.member.hasPermission("ADMINISTRATOR")) return;

        if(args.length == 2) {
            if(args[0] == "create") {
                createServer(message, args[1]);
            }
            else if(args[1] == "all") {
                deleteAllRoles(message.guild.roles);
                deleteAllChannels(message.guild.channels);
            }
            else {
                const teamName = args[1];
                const role = getRole(message.guild.roles, teamName);
    
                deleteRole(role);
                deleteChannels(message.guild.channels, teamName);
            }
        }

        message.delete();
    }
}

deleteRole = (role) => {
    role.delete();
}

deleteAllRoles = (roles) => {
    roles.forEach((role) => {
        if(role.name.includes("team-")) role.delete();
    });
}

deleteAllChannels = (channels) => {
    channels.forEach((channel) => {
        if(channel.name.includes("team-")) {
            channel.delete();
        }
    })
}

deleteChannels = (channels, teamName) => {
    channels.forEach((channel) => {
        if(channel.name == teamName) {
            channel.delete();
        }
    });
}

getRole = (roles, roleName) => {
    const gameRole = roles.find(role => role.name === roleName);
    return gameRole;
}

createServer = (message, gameList) => {
    const gameArray = buildGameArray(gameList);
    createPublicChannels(message);
    createServerRoles(message, gameArray)
    .then(result => {
        createGameChannels(message, gameArray);
    });
}

createGameChannels = async (message, gameArray) => {
    Promise.all(buildGameCategoryPromises(message, gameArray))
}

buildGameCategoryPromises = (message, gameArray) => {
    let retArray = [];

    gameArray.forEach(gameName => {
        retArray.push(createGameCategory(message, gameName));
    });

    return retArray;
}

createGameCategory = async (message, gameName) => {
    message.guild.channels.create(
        gameName,
        {
            type: 'category',
            permissionOverwrites: [
                {
                    id: message.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL']
                },
                {
                    id: await getServerRoleId(message, gameName),
                    allow: ['VIEW_CHANNEL']
                }
            ]
        }
    ).then(channel => {
        console.log(channel.name + " category created. Locking permissions now")
        channel.lockPermissions();

        Promise.all(buildGameChannelPromises(message, channel))
    })
}

buildGameChannelPromises = (message, channel) => {
    let retArray = [];

    retArray.push(createGameChannel(message, "general", "text", channel));
    retArray.push(createGameChannel(message, "looking-for-group", "text", channel));
    retArray.push(createGameChannel(message, "Community 1", "voice", channel));
    retArray.push(createGameChannel(message, "Community 2", "voice", channel));

    return retArray;
}

createGameChannel = (message, gameName, channelName, type, parent) => {
    message.guild.channels.create(
        channelName,
        {
            type: type,
            parent: parent
        }
    )
}

getServerRoleId = (message, roleName) => {
    let allRoles = message.guild.roles.fetch();
    console.log(allRoles);
    let role = allRoles.find(role => role.name == roleName);
    console.log("Role ID for " + roleName + " is " + role.id);
    return role.id
}

buildGameArray = (gameList) => {
    return gameList.split(",");
}

buildGamePromiseArray = (message, gameArray) => {
    let retArray = [];

    gameArray.forEach(gameName => {
        retArray.push(createServerRole(message, gameName))
    });

    return retArray;
}

createServerRoles = (message, gameArray) => {
    return Promise.all(buildGamePromiseArray(message, gameArray))
}

createServerRole = (message, roleName, color = "#ffffff") => {
    return message.guild.roles.create({
        data: {
            name: roleName,
            color: color
        }
    });
}

createPublicChannels = (message) => {
    createServerChannel(message, "announcements", "text", null);
    createServerChannel(message, "welcome", "text", null);
    createServerChannel(message, "general", "text", null);
    createServerChannel(message, "command-spam", "text", null);
}

createServerChannel = (message, name, type, categoryName) => {
    message.guild.channels.create(name, { type: type })
    .then(channel => {
        if(categoryName) {
            addChannelToCategory(message, channel, categoryName);
        }
    });
}

addChannelToCategory = (message, channel, categoryName) => {
    const category = message.guild.channels.find(c => c.name == categoryName && c.type == "category");
    if(category && channel) {
        channel.setParent(category);
    }
}