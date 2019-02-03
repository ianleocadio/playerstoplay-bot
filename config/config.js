const Discord = require("discord.js");
let BOT_CONFIG = require("./bot_config.js");
const Utils = require("../util/utils.js");
const CommandMap = require("../commands/CommandMap");

/******************************************************
 *													  *
 *													  *
 *				Command's functions					  *
 *													  *
 *													  *
 ******************************************************/
function showConfigInfo(message) {
    let embed = new Discord.RichEmbed();
    embed.setAuthor("Configurações atuais:")
        .setColor("RED");
    let textChannelStr = "\n";
    BOT_CONFIG.textChannels.map(function (tc) {
        textChannelStr += "**" + tc.toString() + "**\n";
    });
    let voiceChannelStr = "\n";
    BOT_CONFIG.voiceChannels.map(function (vc) {
        voiceChannelStr += "**" + vc.toString() + "**\n";
    });

    embed.addField("Chats padrões", (BOT_CONFIG.textChannels.length > 0) ? textChannelStr : "Não definido", true)
        .addField("Canais de voz padrão", (BOT_CONFIG.voiceChannels > 0) ? voiceChannelStr : "Não definido", true);

    message.channel.send(embed);
}

function configInfo() {
    return new Discord.RichEmbed()
        .setColor("RED")
        .setAuthor("Configuração alterada:");
}

function setTextChannel(message, commandArguments) {
    let textChannels = Array.prototype.slice.call(commandArguments, 2);
    //console.log(textChannels);
    textChannels = Utils.arrayToMap(textChannels);
    //console.log(textChannels);

    if (!textChannels) {return;}

    textChannels.forEach((t) => {
        let textChannel = message.guild.channels.find((tc) => {
            return (tc.name === t) && (tc.type === "text");
        });
        //console.log(textChannel);
        if (textChannel) {
            if (!BOT_CONFIG.textChannels.includes(textChannel)) {
                BOT_CONFIG.textChannels.push(textChannel);
            } else{
                return;
            }
        }
    });
    let embed = configInfo();
    let canais = "\n";
    BOT_CONFIG.textChannels.map((tc) => {
        canais += "**" + tc.toString() + "**\n";
    });
    embed.addField("Chat padrão", "Comandos do bot só poderão ser realizados nos chats: " + canais, true)
        .addField("Modificado por", message.author.toString(), false);
    message.channel.send(embed);

}

function setVoiceChannel(message, commandArguments) {
    let voiceChannels = Array.prototype.slice.call(commandArguments, 2);
    voiceChannels = Utils.arrayToMap(voiceChannels);
    

    if (!voiceChannels) {return;}

    voiceChannels.forEach((v) => {
        let voiceChannel = message.guild.channels.find((vc) => {
            return (vc.name === v) && (vc.type === "voice");
        });
        if (voiceChannel) {
            console.log(voiceChannel.name + " - " + voiceChannel.type);
            if (!BOT_CONFIG.voiceChannels.includes(voiceChannel)) {
                BOT_CONFIG.voiceChannels.push(voiceChannel);
            } else{
                return;
            }
        }
    });
    let embed = configInfo();
    let canais = "\n";
    BOT_CONFIG.voiceChannels.map((vc) => {
        canais += "**" + vc.toString() + "**\n";
    });
    embed.addField("Chat padrão", "O bot só poderá entrar nos canais: " + canais, true)
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
 *						Command					      *
 *													  *
 *													  *
 ******************************************************/
let commandsList = new CommandMap();
commandsList.set(/^(?:tc|textchannel)$/g, setTextChannel);
commandsList.set(/^(?:vc|voicechannel)$/g, setVoiceChannel);



function commands(message) {
    let commandArguments = message.content.match(/\S+/g);
    let command = (commandArguments[1] || "").toLowerCase();

    if (!command) {
        ConfigPermissions.call(message, showConfigInfo, message);
        return;
    } else {

        command = commandsList.getCommandImplementation(command);
        if (command) {
            ConfigPermissions.call(message, command, message, commandArguments);
        } else {
            ConfigPermissions.call(message, showConfigInfo, message);
            return;
        }
    }

}



/******************************************************
 *													  *
 *													  *
 *						Exports 					  *
 *													  *
 *													  *
 ******************************************************/
module.exports = { commands };