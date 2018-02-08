const Discord = require("discord.js");
let BOT_CONFIG = require("./bot_config.js");

const Utils = require("../util/utils.js");

function commands(message){
	let commandArguments = message.content.match(/\S+/g);
	let command = (commandArguments[1] || "").toLowerCase();
	
	if(!commandArguments[1]){
	    ConfigPermissions.call(message, showConfigInfo, message);
	}else

	if(command === "textchannel" || command === "tc"){
	    ConfigPermissions.call(message, setTextChannel, message, commandArguments);
	}else

	if(command === "voicechannel" || command === "vc"){
	    ConfigPermissions.call(message, setVoiceChannel, message, commandArguments);
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
	let embed = new Discord.RichEmbed();
	embed.setAuthor("Configurações atuais:")
		 .setColor("RED");
	let textChannelStr = "\n";
	BOT_CONFIG.textChannels.map(function(tc){
	    textChannelStr += "**"+tc.toString()+"**\n";
    });
	let voiceChannelStr = "\n";
	BOT_CONFIG.voiceChannels.map(function(vc){
        voiceChannelStr += "**"+vc.toString()+"**\n";
    });

    embed.addField("Chats padrões", (BOT_CONFIG.textChannels.length > 0) ? textChannelStr : "Não definido", true)
		 .addField("Canais de voz padrão", (BOT_CONFIG.voiceChannels > 0) ? voiceChannelStr : "Não definido", true);

	message.channel.send(embed);
}

function configInfo(){
    return new Discord.RichEmbed()
        .setColor("RED")
        .setAuthor("Configuração alterada:")
}

function setTextChannel(message, commandArguments){
	let textChannels = Array.prototype.slice.call(commandArguments, 2);

    for(i=0; i < textChannels.length; i++){
        let textChannel = message.guild.channels.find(function(tc){
            return (tc.name === textChannels[i]) && (tc.type === "text");
        });
        if (textChannel){
            if(!BOT_CONFIG.textChannels.includes(textChannel)){
                BOT_CONFIG.textChannels.push(textChannel);
            }else
                return;
        }
    }
    let embed = configInfo();
    let canais = "\n";
    BOT_CONFIG.textChannels.map(function(tc){
        canais += "**"+tc.toString()+"**\n";
    });
    embed.addField("Chat padrão", "Comandos do bot só poderão ser realizados nos chats: "+canais, true)
        .addField("Modificado por", message.author.toString(), false);
    message.channel.send(embed);

}

function setVoiceChannel(message, commandArguments){
    let voiceChannels = Array.prototype.slice.call(commandArguments, 2);

    for(i=0; i < voiceChannels.length; i++){
        let voiceChannel = message.guild.channels.find(function(vc){
            return (vc.name === voiceChannels[i]) && (vc.type === "voice");
        });
        if (voiceChannel){
            console.log(voiceChannel.name +" - "+ voiceChannel.type);
            if(!BOT_CONFIG.voiceChannels.includes(voiceChannel)){
                BOT_CONFIG.voiceChannels.push(voiceChannel);
            }else
                return;
        }
    }
    let embed = configInfo();
    let canais = "\n";
    BOT_CONFIG.voiceChannels.map(function(vc){
        canais += "**"+vc.toString()+"**\n";
    });
    embed.addField("Chat padrão", "O bot só poderá entrar nos canais: "+canais, true)
        .addField("Modificado por", message.author.toString(), false);
    message.channel.send(embed);
}
/******************************************************
 *													  *
 *													  *
 *						Permissions					  *
 *													  *
 *													  *
 ******************************************************/
const Permissions = require("../config/permissions.js");
let functions = [
    showConfigInfo,
    setTextChannel,
    setVoiceChannel
];
let ConfigPermissions = new Permissions(Utils.createListOfPermissions(functions));

/******************************************************
 *													  *
 *													  *
 *						Exports 					  *
 *													  *
 *													  *
 ******************************************************/
module.exports = {
	"commands": commands
}


