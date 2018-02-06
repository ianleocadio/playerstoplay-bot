const Discord = require("discord.js");
const auth = require('./auth/auth.js');

const Commands = require('./commands/commands.js');
var BOT_CONFIG = require("./config/bot_config.js")


var bot = new Discord.Client({disableEveryone: true});


bot.on("ready", () => {
	console.log("BOT Online");
});

// bot.on('guildMemberAdd', member => {
//   // Send the message to a designated channel on a server:
//   const channel = member.guild.channels.find('name', 'lobby');
//   const players_role = member.guild.roles.find('name', 'Players');
//   // Do nothing if the channel wasn't found on this server
//   if (!channel) return;
//   // Send the message, mentioning the member
//   channel.send("Eai mano "+ member +" ? De boa ? Qualquer dúvida use /help ou chame um Mod!\n Ou "+players_role+" seus cuzões! Cara novo ai!");
// });

bot.on("message", message => {
	var commands = message.content.toLowerCase().match(/\S+/g);

	//Verificando qual o comando e repassando a resposabilidade de execução
	if(commands && commands[0].startsWith(".")){

		//Restrições
		if(message.channel.type !== "text")
			return;
		if(BOT_CONFIG.textChannel && message.channel.id !== BOT_CONFIG.textChannel.id){
			message.author.send("Os comandos deste bot só são permitidos no chat: **#"+ BOT_CONFIG.textChannel.name+"**");
			message.delete();
			return;
		}

		if(commands[0] === ".help" || commands[0] === ".h"){
			// Commands.Help.listHelp(message);
			return;
		}else
		if(commands[0] === ".add"){
			Commands.Roles.addPlayerRole(message);
			return;
		}else
		if(commands[0] === ".music" || commands[0] === ".m"){
			Commands.Music.commands(message, bot);
			return;
		}else
		if(commands[0] === ".config" || commands[0] === ".c"){
			Commands.Config.commands(message);
			return;
		}else

		if(commands[0] === ".clear" || commands[0] === ".clean"){
			var limit = (commands[1] || 50);
			message.channel.fetchMessages({"limit": limit})
				.then(function(messages){
					message.channel.bulkDelete(messages);
				}, 
				function(error){
					console.log(error);
					return;	
				});
			return;
		}else

		if(commands[0] === ".t"){
			var customChannels = message.guild.channels.find('name', 'Salas personalizadas');
			
			if(commands[1] === "add"){
				var name = Array.prototype.slice.call(commands, 2).toString();
				name = name.replace(/,/g, " ");
				var c = message.guild.channels.find('name', name);


				message.guild.createChannel(name, 'voice')
					.then(channel => {
						// message.author.send("Canal criado com sucesso!");
						channel.setParent(customChannels);

					})
					.catch(console.error);
			}else

			if(commands[1] === "remove"){
				var name = Array.prototype.slice.call(commands, 2).toString();
				name = name.replace(/,/g, " ");
				var channel = message.guild.channels.find('name', name, 'type', 'voice', 'parentID', customChannels.id);

				if(channel){
					channel.delete()
						.then(() => {
							// message.author.send("Canal removido");
						})
						.catch(console.error);
				}
			}


			return;
		}
		//Comandos...

		//Final
		Commands.Help.possibleCommand(message);

	}

});

bot.login(auth.token || process.env.BOT_TOKEN);

