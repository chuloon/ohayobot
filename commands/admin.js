module.exports = {
    name: 'admin',
    description: 'Admin controls to delete teams. If you need to use this help command, you probably can\'t use it anyway. kthxbye',
    usage: 'delete <team_name>',
    execute(message, args) {
        if(!message.member.hasPermission("ADMINISTRATOR")) return;

        message.reply("admin controls accessed.");
    }
}