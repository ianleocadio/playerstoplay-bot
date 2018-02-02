const Discord = require("discord.js");
var BOT_CONFIG = require("./bot_config.js");


function commands(message){
	var commandArguments = message.content.match(/\S+/g);
	var command = commandArguments[1].toLowerCase();
	
	if(!command){
		return;
	}

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
function setTextChannel(message, commandArguments){
	var textChannel = commandArguments[2];

	try{
		textChannel = message.guild.channels.find('name', textChannel, 'type', 'text');
	}catch(e){
		return message.reply("Esse chat não existe!"); 
	}
		
	BOT_CONFIG.textChannel = textChannel;

	message.channel.send(
	configInfo().addField("Chat padrão", "Comandos do bot só poderão ser\nrealizados no chat: **<#"+textChannel.id+">**", true)
				.addBlankField(true)
				.addField("Modificado por", message.author.username+"#"+message.author.discriminator, true)
	);
}

function setVoiceChannel(message, commandArguments){
	var voiceChannel = commandArguments[2];

	try{
		voiceChannel = message.guild.channels.find('name', voiceChannel, 'type', 'voice');
	}catch(e){
		return message.reply("Esse canal não existe!"); 
	}
		
	BOT_CONFIG.voiceChannel = voiceChannel;

	message.channel.send(
	configInfo().addField("Canal de voz padrão", "O bot só pode entrar no canal de voz: **<#"+voiceChannel.id+">**", true)
				.addBlankField(true)
				.addField("Modificado por", message.author.username+"#"+message.author.discriminator, true)
	);
}

function configInfo(){
	return new Discord.RichEmbed()
			.setColor("RED")
			.setAuthor("Configuração alterada:")
}

module.exports = {
	"commands": commands
}


