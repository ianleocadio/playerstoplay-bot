function addPlayerRole(message) {

    let playersRole = message.guild.roles.find("name", "Players");

    if (!message.member.roles.some(r => ["Players", "Admin", "Mods", "Equipe PlayersToPlay"].includes(r.name))){
        message.reply("É preciso ter o cargo Players ou superior para pode adicionar o cargo em outros membros");
    }

    var members = message.mentions.members;

    members.forEach(function (member) {
        if (!member.roles.has(playersRole.id)) {
            member.addRole(playersRole).catch(console.error);
        } else {
            message.reply(member.displayName + " já possuí o cargo Players");
        }

    });

}


module.exports = { addPlayerRole };