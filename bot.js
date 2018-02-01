const Discord = require("discord.js");
const auth = require('./auth/auth.js');

const Commands = require('./commands/commands.js');





var bot = new Discord.Client({disableEveryone: true});

bot.on("ready", () => {
	console.log("BOT Online");
});

bot.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find('name', 'lobby');
  const players_role = member.guild.roles.find('name', 'Players');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send("Eai mano "+ member +" ? De boa ? Qualquer dúvida use /help ou chame um Mod!\n Ou "+players_role+" seus cuzões! Cara novo ai!");
});




bot.on("message", message => {
	var commands = message.content.toLowerCase().match(/\S+/g);

	if(commands && commands[0].startsWith(".")){

		if(commands[0] === ".help" || commands[0] === ".h"){
			Commands.Help.listHelp(message);
			return;
		}else
		if(commands[0] === ".add"){
			Commands.Roles.addPlayerRole(message);
			return;
		}else
		if(commands[0] === ".music" || commands[0] === ".m"){
			Commands.Music.musicCommands(message, bot);
			return;
		}
		//Comandos...

		//Final
		Commands.Help.possibleCommand(message);

	}

});

bot.login(auth.token || process.env.BOT_TOKEN);

