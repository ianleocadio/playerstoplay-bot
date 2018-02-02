const Discord = require("discord.js");
var BOT_CONFIG = require("./bot_config.js");


function commands(message){
	var commandArguments = message.content.match(/\S+/g);
	var command = (commandArguments[1] || "").toLowerCase();
	
	if(!commandArguments[1]){
		showConfigInfo(message);
	}else

	if(command === "textchannel" || command === "tc"){
		setTextChannel(message, commandArguments);
	}else

	if(command === "voicechannel" || command === "vc"){
		setVoiceChannel(message, commandArguments);
	}

}

/******************************************************
 *													  *
 *													  *
 *				Command's functions					  *
 *													  *
 *													  *
 ******************************************************/
function showConfigInfo(message){
	var embed = new Discord.RichEmbed();
	embed.setAuthor("Configurações atuais:")
		 .setColor("RED")
		 .addField("Chat padrão", (BOT_CONFIG.textChannel) ? "<#"+BOT_CONFIG.textChannel.id+">" : "Não definido", true)
		 .addField("Canal de voz padrão", (BOT_CONFIG.voiceChannel) ? "<#"+BOT_CONFIG.voiceChannel.id+">" : "Não definido", true);
	message.channel.send(embed);
}


function setTextChannel(message, commandArguments){
	var textChannel = commandArguments[2];

	try{
		textChannel = message.guild.channels.find('name', textChannel, 'type', 'text');

		BOT_CONFIG.textChannel = textChannel;

		message.channel.send(
		configInfo().addField("Chat padrão", "Comandos do bot só poderão ser realizados no chat: **<#"+textChannel.id+">**", true)
					.addField("Modificado por", message.author.username+"#"+message.author.discriminator, true)
		);

	}catch(e){
		message.reply("Informe um chat existente para adicionar nas configurações"); 
		return;
	}
}

function setVoiceChannel(message, commandArguments){
	var voiceChannel = commandArguments[2];

	try{
		voiceChannel = message.guild.channels.find('name', voiceChannel, 'type', 'voice');

		BOT_CONFIG.voiceChannel = voiceChannel;

		message.channel.send(
		configInfo().addField("Canal de voz padrão", "O bot só pode entrar no canal de voz: **<#"+voiceChannel.id+">**", true)
					.addField("Modificado por", message.author.username+"#"+message.author.discriminator, true)
		);

	}catch(e){
		message.reply("Esse canal não existe!"); 
		return;
	}
}

function configInfo(){
	return new Discord.RichEmbed()
			.setColor("RED")
			.setAuthor("Configuração alterada:")
}

module.exports = {
	"commands": commands
}


