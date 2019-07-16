module.exports = {
    name: 'admin',
    description: 'Admin controls to delete teams. If you need to use this help command, you probably can\'t use it anyway. kthxbye',
    usage: 'delete <team_name>',
    execute(message, args) {
        if(!message.member.hasPermission("ADMINISTRATOR")) return;

        if(args.length == 2) {
            const teamName = args[1];
            const role = getRole(message.guild.roles, teamName);

            //deleteRole(role);
            deleteChannels(message.guild.channels, teamName);
        }
    }
}

deleteRole = (role) => {
    role.delete();
}

deleteChannels = (channels, teamName) => {
    const channel = channels.find(c => c.name == teamName);

    channel.forEach(c => {
        c.delete();
    });
}

getRole = (roles, roleName) => {
    const gameRole = roles.find(role => role.name === roleName);
    return gameRole;
}