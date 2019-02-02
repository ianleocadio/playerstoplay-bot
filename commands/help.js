const Discord = require("discord.js");
const Utils = require("../util/utils.js");
//const CommandMap = require("./CommandMap");
/******************************************************
 *													  *
 *													  *
 *				Auxiliary's functions				  *
 *													  *
 *													  *
 ******************************************************/
var helpEmbed = new Discord.RichEmbed()
	.setAuthor("Lista de comandos:")
	.setColor("GREEN")
	// .description("Commandos")
	.addField("Música [ .music | .m <command> ]:", "play | p\nstop\npause | p\nresume | r\nplaylist | pl\nplaying | now", true)
	.addField("Cargos:", ".add", true)
	.addField("Canais [ .channel | .ch <command> ]:", "add | a\nremove | del", true);

/******************************************************
*													  *
*													  *
*				Command's functions					  *
*													  *
*													  *
******************************************************/


function help(message) {
	message.author.send(helpEmbed);
}

function possibleCommand(message) {
	var cantExecuteHelpCommand = false;
	message.channel.fetchMessages({ limit: 5, before: message.id })
		.then((messages) => {
			const alreadyCommands = ["/gamerescape", "/xivdb", "/giphy", "/tenor", "/tts", "/me", "/tableflip", "/unflip", "/shrug"];
			var noneOfThen = true;
			alreadyCommands.map((command) => {
				if (message.content.startsWith(command)){
					noneOfThen = false;
				}
			});
			messages.map((bm) => {
				if (bm.content.startsWith("/") && noneOfThen && (Date.now() - bm.createdTimestamp < 300000)){
					cantExecuteHelpCommand = true;
				}
			});

			if (cantExecuteHelpCommand) {
				message.delete();
				return;
			}

			if (noneOfThen){
				message.reply("Possível tentativa de usar um comando avistado! Utilize '.help' para listar os comandos atuais  :upside_down:");
			}
		});

}
/******************************************************
*													  *
*													  *
*						Permissions					  *
*													  *
*													  *
******************************************************/
const Permissions = require("../config/permissions.js");
var functions = [
	help,
	possibleCommand
];
var HelpPermissions = new Permissions(Utils.createListOfPermissions(functions));

/******************************************************
 *													  *
 *													  *
 *						Command					      *
 *													  *
 *													  *
 ******************************************************/
//let commandsList = new CommandMap();

function commands(message) {

	HelpPermissions.call(message, help, message);

}

/******************************************************
 *													  *
 *													  *
 *						Exports 					  *
 *													  *
 *													  *
 ******************************************************/
module.exports = {
	commands,
	possibleCommand
};