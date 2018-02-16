const Discord = require("discord.js");
const auth = require('./auth/auth.js');

const Commands = require('./commands/commands.js');
var BOT_CONFIG = require("./config/bot_config.js")


var bot = new Discord.Client({disableEveryone: true});


bot.on("ready", () => {
	console.log("BOT Online");
	const con = require("./model/db/db.js");
	con.initialize();
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
	let commands = message.content.toLowerCase().match(/\S+/g);

	//Verificando qual o comando e repassando a resposabilidade de execução
	if(commands && commands[0].startsWith(".")){

		if(commands[0] === ".clear" || commands[0] === ".clean"){
			let limit = (commands[1] || 50);
			message.channel.fetchMessages({"limit": limit})
				.then(function(messages){
					try{
						message.channel.bulkDelete(messages);
					}catch(e){
						message.channel.delete().then(function(channel){
							console.log(channel);
						})
					}
				}, 
				function(error){
					console.log(error);
					return;	
				});
			return;
		}
		//Restrições
		if(message.channel.type !== "text")
			return;
		
		if(!(auth.STAFF.has(message.member.highestRole.id))
            &&
		    BOT_CONFIG.textChannels.length > 0 && !BOT_CONFIG.textChannels.includes(message.channel)){
            let str = "\n";
			BOT_CONFIG.textChannels.map(function(tc){
				str += "**"+tc.toString()+"**\n";
			});
			message.author.send("Os comandos deste bot só são permitidos nos chats: "+str);
			message.delete();
			return;
		}

		if(commands[0] === ".help" || commands[0] === ".h"){
			Commands.Help.commands(message);
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

		if(commands[0] === ".channel" || commands[0] === ".ch"){
			//Commands.Channel.commands(message);
			return;
		}else

		if(commands[0] === ".t"){
			const GoogleImages = require('google-images');
			const client = new GoogleImages('015410166601801766056:gzoxonezzps', auth.yt_key);

			let query = Array.prototype.slice.call(commands, 1).toString();
			query = query.replace(/,/g, " "); 
			query = query.replace(/(\<@.*?\>)/gi, ""); 

			let toWho = message.mentions.users;
			
			client.search(query)
			    .then(images => {
			        toWho.map(function(who){
			        	who.send(images[0].url);
			        });
			        message.delete();
			    });

			return;
		}else

		if(commands[0] === ".r34"){
			var GoogleSearch = require('google-search');
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
			}, function(error, response) {
			  if(response.items){
			  	message.author.send(response.items[0].link);
			  }
			});


			return;
		}
		//Comandos...

		//Final
		Commands.Help.possibleCommand(message);

	}

});


bot.on("channelDelete", channel => {
	Commands.Channel.deleteChannelFromDB(channel);
});

bot.login(auth.token);

