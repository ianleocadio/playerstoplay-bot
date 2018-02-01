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
	

	if(message.content.startsWith("/")){
		if(message.content.startsWith("/help")){
			Commands.Help.listHelp(message);
			return;
		}

		if(message.content.startsWith("/add")){
			Commands.Roles.addPlayerRole(message);
			return;
		}



		if(message.content.startsWith("/music")){
			Commands.Music.musicCommands(message, bot);
			return;
		}

		

		//Comandos...

		//Final
		Commands.Help.possibleCommand(message);

	}

});

bot.login(auth.token || process.env.BOT_TOKEN);

