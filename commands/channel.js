const Discord = require("discord.js");
// const auth = require('../auth/auth.js');
const Utils = require("../util/utils.js");




function commands(message){
	var commandArguments = message.content.match(/\S+/g);
	try{
		var command = commandArguments[1].toLowerCase();
	}catch(e){
		return;
	}

	if(!command){
		return;
	}else

	if(command === "add" || command === "a"){
		ChannelPermissions.call(message, add, message, commandArguments);
	}else

	if(command === "remove" || command === "rem"){
		ChannelPermissions.call(message, remove, message, commandArguments);
	}else

	if(command === "perm"){
		ChannelPermissions.commands(message);
	}
}




/******************************************************
 *													  *
 *													  *
 *				Auxiliary's functions				  *
 *													  *
 *													  *
 ******************************************************/
const Model = require("../model/models.js");
var model = new Model();
console.log(model);

/******************************************************
 *													  *
 *													  *
 *				Command's functions					  *
 *													  *
 *													  *
 ******************************************************/
function add(message, commandArguments){
	var customChannels = message.guild.channels.find('name', 'Salas personalizadas');
			
	var name = Array.prototype.slice.call(commandArguments, 2).toString();
	name = name.replace(/,/g, " ");
	
	var channel = message.guild.channels.find('name', name);

	if(channel){
		console.log("Erro");
		return;
	}

	message.guild.createChannel(name, 'voice')
		.then(channel => {
			// message.author.send("Canal criado com sucesso!");
			channel.overwritePermissions(message.author, {
			  MANAGE_CHANNELS: true,
			  KICK_MEMBERS: true,
			  MUTE_MEMBERS: true,
			  CREATE_INSTANT_INVITE: true
			})
			  .then(channel => {
			  	channel.setParent(customChannels);
			  	var u = Utils.uuid();
			  	model.insert("CHANNELS", 
			  		"ID, USER_ID, USER, CHANNEL_ID, CHANNEL, CREATED_AT",
			  		[Utils.uuid(), message.author.id, message.author.username,
			  		channel.id, channel.name, Date.now()]);

			  })
			  .catch(console.error);

		})
		.catch(console.error);

}

function remove(message, commandArguments){
	var customChannels = message.guild.channels.find('name', 'Salas personalizadas');
	var name = Array.prototype.slice.call(commandArguments, 2).toString();
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
 *						Exports 					  *
 *													  *
 *													  *
 ******************************************************/
module.exports = {
	"commands": commands
}