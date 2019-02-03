const Discord = require("discord.js");
const auth = require("./auth/auth.js");
const Commands = require("./commands/commands.js");
var BOT_CONFIG = require("./config/bot_config.js");
const CommandMap = require("./commands/CommandMap");

var bot = new Discord.Client({ disableEveryone: true });

//https://discordapp.com/oauth2/authorize?client_id=%3cBot_Client_ID%3e&scope=bot&permissions=8

bot.on("ready", () => {
	console.log("BOT Online");
	const con = require("./model/db/db.js");
	con.initialize();
});

// bot.on("guildMemberAdd", member => {
//   // Send the message to a designated channel on a server:
//   const channel = member.guild.channels.find("name", "lobby");
//   const players_role = member.guild.roles.find("name", "Players");
//   // Do nothing if the channel wasn"t found on this server
//   if (!channel) return;
//   // Send the message, mentioning the member
//   channel.send("Eai mano "+ member +" ? De boa ? Qualquer dúvida use /help ou chame um Mod!\n Ou "+players_role+" seus cuzões! Cara novo ai!");
// });
function cleanMessanges(message) {
	let commands = message.content.toLowerCase().match(/\S+/g);
	let limit = (commands[1] || 50);
	message.channel.fetchMessages({ limit })
		.then((messages) => {
			try {
				message.channel.bulkDelete(messages);
			} catch (e) {
				message.channel.delete().then((channel) => {
					console.log(channel);
				});
			}
		}, (error) => {
			console.log(error);
			return;
		});
}

function searchOnGoogle(message) {
	let commands = message.content.toLowerCase().match(/\S+/g);
	const GoogleImages = require("google-images");
	const client = new GoogleImages("015410166601801766056:gzoxonezzps", auth.yt_key);

	let query = Array.prototype.slice.call(arguments, 1).toString();
	query = query.replace(/,/g, " ");
	query = query.replace(/(\<@.*?\>)/gi, "");

	let toWho = message.mentions.users;

	client.search(query)
		.then((images) => {
			toWho.map((who) => {
				who.send(images[0].url);
			});
			message.delete();
		});
}

function r34(message) {
	let commands = message.content.toLowerCase().match(/\S+/g);
	var GoogleSearch = require("google-search");
	var googleSearch = new GoogleSearch({
		key: auth.yt_key,
		cx: "015410166601801766056:ki1ibtmmofm"
	});

	let query = Array.prototype.slice.call(commands, 1).toString();
	query = query.replace(/,/g, " ");
	query = query.replace(/(\<@.*?\>)/gi, "");

	let toWho = message.mentions.users;

	googleSearch.build({
		q: query,
		num: 10, // Number of search results to return between 1 and 10, inclusive 
		siteSearch: "www.rule34.paheal.net" // Restricts results to URLs from a specified site 
	}, (error, response) => {
		if (response.items) {
			message.author.send(response.items[0].link);
		}
	});
}


let commandsList = new CommandMap();
commandsList.set(/^(?:clean|clear)$/g, cleanMessanges);
commandsList.set(/^(?:h|help)$/g, Commands.Help.commands);
commandsList.set(/^(?:add)$/g, Commands.Roles.addPlayerRole);
commandsList.set(/^(?:m|music)$/g, Commands.Music.commands);
commandsList.set(/^(?:c|config)$/g, Commands.Config.commands);
commandsList.set(/^(?:ch|channel)$/g, Commands.Channel.commands);
commandsList.set(/^(?:wrf|warframe)$/g, Commands.Warframe.commands);
commandsList.set(/^(?:g|google)$/g, searchOnGoogle);
commandsList.set(/^(?:r34)$/g, r34);

bot.on("message", (message) => {
	let commands = message.content.toLowerCase().match(/\S+/g);

	//Verificando qual o comando e repassando a resposabilidade de execução
	if (commands && commands[0].startsWith(".")) {
		let command = null;
		try {
			command = commands[0].replace(".", "");
		}catch(e){
			Commands.Help.possibleCommand(message);
			return;
		}

		//Restrições
		if (message.channel.type !== "text") {
			return;
		}

		if (!(auth.STAFF.has(message.member.highestRole.id)) && BOT_CONFIG.textChannels.length > 0 && !BOT_CONFIG.textChannels.includes(message.channel)) {
			let str = "\n";
			BOT_CONFIG.textChannels.map((tc) => {
				str += "**" + tc.toString() + "**\n";
			});
			message.author.send("Os comandos deste bot só são permitidos nos chats: " + str);
			message.delete();
			return;
		}

		if (!command) {
			Commands.Help.possibleCommand(message);
			return;
		}else{
			command = commandsList.getCommandImplementation(command);
			if (command) {
				command(message);
			}else{
				if (commands[0] === ".lulalivre") {
					message.channel.send("LULA TA PRESO! BABACA!");
					return;
				}
				if (commands[0] === ".gloria") {
					message.channel.send("A DEUXXXXXX!!!");
					return;
				}
				Commands.Help.possibleCommand(message);
				return;
			}
		}

		

	}

});


bot.on("channelDelete", (channel) => {
	Commands.Channel.deleteChannelFromDB(channel);
});

bot.login(auth.token);

