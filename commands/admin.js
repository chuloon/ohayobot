module.exports = {
    name: 'admin',
    description: 'Admin controls to delete teams. If you need to use this help command, you probably can\'t use it anyway. kthxbye',
    usage: 'delete <team_name> | create',
    execute(message, args) {
        if(!message.member.hasPermission("ADMINISTRATOR")) return;

        if(args.length == 1) {
            if(args[0] == "create") {
                createServer(message);
            }
        }
        else if(args.length == 2) {
            if(args[1] == "all") {
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

createServer = (message) => {
    createPublicChannels(message);
}

createPublicChannels = (message) => {
    createServerChannel(message, "announcements", "text", null);
    createServerChannel(message, "welcome", "text", null);
    createServerChannel(message, "general", "text", null);
    createServerChannel(message, "command-spam", "text", null);
}

createServerChannel = (message, name, type, categoryName) => {
    message.guild.createChannel(name, type)
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