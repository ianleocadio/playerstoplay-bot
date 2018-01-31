const Discord = require("discord.js");
const auth = require("./auth.json")

const Commands = require('./commands/commands.js');

var bot = new Discord.Client({disableEveryone: true});

bot.on("ready", () => {
	console.log("BOT Online");
});

bot.on("message", message => {
	

	if(message.content.startsWith("/")){
		if(message.content.startsWith("/help")){
			Commands.Help.listHelp(message);
			return;
		}

		//Comandos...


		//Final
		Commands.Help.possibleCommand(message);

	}

});

bot.login(auth.token || process.env.BOT_TOKEN);

