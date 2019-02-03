const Discord = require("discord.js");
// const auth = require("../auth/auth.js");
const Utils = require("../util/utils.js");

/******************************************************
 *													  *
 *													  *
 *				Auxiliary"s functions				  *
 *													  *
 *													  *
 ******************************************************/
const Models = require("../model/models.js");
let channelModel = new Models.Channel();

/******************************************************
 *													  *
 *													  *
 *				Command"s functions					  *
 *													  *
 *													  *
 ******************************************************/
function add(message, commandArguments) {
	var customChannels = message.guild.channels.find("name", "Salas personalizadas");

	var name = Array.prototype.slice.call(commandArguments, 2).toString();
	name = name.replace(/,/g, " ");


	channelModel.canCreate(message, function (canCreate, reason) {
		if (!canCreate) {
			message.author.send(reason);
			return;
		}

		var channel = message.guild.channels.find(function (c) {
			return c.name === name && c.type === "voice";
		});

		if (channel) {
			channelModel.findOne("USER_ID, CHANNEL_ID", [message.author.id, channel.id], (c, error) => {
				if (error) { return console.log(error) };
				if (c) {
					message.author.send("Você já possui um canal personalizado no PlayersToPlay com este nome");
				}
			});
			return;
		}

		message.guild.createChannel(name, "voice")
			.then((channel) => {
				// message.author.send("Canal criado com sucesso!");
				channel.overwritePermissions(message.author, {
					MANAGE_CHANNELS: true,
					KICK_MEMBERS: true,
					MUTE_MEMBERS: true,
					CREATE_INSTANT_INVITE: true
				}).then((channel) => {
						channel.setParent(customChannels);
						channelModel.insert("ID, USER_ID, CHANNEL_ID, CREATED_AT",
							[Utils.uuid(), message.author.id,
							channel.id, Date.now()], (error) => {
								if (error) {
									throw error;
								}
							});
					})
					.catch(console.error);

			})
			.catch(console.error);

	});




}

function remove(message, commandArguments) {
	var customChannels = message.guild.channels.find("name", "Salas personalizadas");
	var name = Array.prototype.slice.call(commandArguments, 2).toString();
	name = name.replace(/,/g, " ");

	var channel = message.guild.channels.find("name", name, "type", "voice", "parentID", customChannels.id);

	if (channel) {
		channelModel.canRemove(message, channel.id, (canRemove, reason) => {
			if (!canRemove) {
				message.author.send(reason);
				return;
			}

			channel.delete()
				.then(() => {
					// message.author.send("Canal removido");
					channelModel.delete("USER_ID, CHANNEL_ID",
						[message.author.id, channel.id], (error) => {
							if (error) {
								throw error;
							}
						});
				})
				.catch(console.error);
		});
	}
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
	add,
	remove
];
var ChannelPermissions = new Permissions(Utils.createListOfPermissions(functions));

/******************************************************
 *													  *
 *													  *
 *						Command 					  *
 *													  *
 *													  *
 ******************************************************/


let commandsList = new CommandMap();
commandsList.set(/^(?:add)$/g, add);
commandsList.set(/^(?:delete|remove)$/g, remove);

function commands(message) {
	var commandArguments = message.content.match(/\S+/g);
	var command = null;
	try {
		command = commandArguments[1].toLowerCase();
	} catch (e) {
		return;
	}

	if (!command) {
		return;
	} else {
		command = commandsList.getCommandImplementation(command);
		if (command) {
			ChannelPermissions.call(message, command, message, commandArguments);
		} else {
			return;
		}
	}
}





/******************************************************
 *													  *
 *													  *
 *						Bot functions    			  *
 *													  *
 *													  *
 ******************************************************/
function deleteChannelFromDB(channel) {
	channelModel.delete("CHANNEL_ID", [channel.id]);
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
	deleteChannelFromDB
};