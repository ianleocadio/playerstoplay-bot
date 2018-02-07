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

	if(command === "remove" || command === "del"){
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
const Models = require("../model/models.js");
var channelModel = new Models.Channel();

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
	

	channelModel.canCreate(message, function(canCreate, reason){
		if(!canCreate){
			message.author.send(reason);
			return;
		}

		var channel = message.guild.channels.find('name', name);

		if(channel){
			channelModel.findOne("USER_ID, CHANNEL_ID", [message.author.id, channel.id], 
			function(c, error){
				if(error) return console.log(error);

				message.author.send("Você já possui um canal personalizado no PlayersToPlay com este nome");		
			});
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
				  	channelModel.insert("ID, USER_ID, CHANNEL_ID, CREATED_AT",
								  		[Utils.uuid(), message.author.id,
								  		channel.id, Date.now()], function(error){
								  			if (error) {

								  			}
								  		});
				  })
				  .catch(console.error);

			})
			.catch(console.error);

	});


	

}

function remove(message, commandArguments){
	var customChannels = message.guild.channels.find('name', 'Salas personalizadas');
	var name = Array.prototype.slice.call(commandArguments, 2).toString();
	name = name.replace(/,/g, " ");
	
	var channel = message.guild.channels.find('name', name, 'type', 'voice', 'parentID', customChannels.id); 

	if(channel){
		channelModel.canRemove(message, channel.id, function(canRemove, reason){
			if(!canRemove){
				message.author.send(reason);
				return;
			}

			channel.delete()
				.then(() => {
					// message.author.send("Canal removido");
					channelModel.delete("USER_ID, CHANNEL_ID",
					  		[message.author.id, channel.id], function(error){
								  			if (error) {
								  				
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
 *						Bot functions    			  *
 *													  *
 *													  *
 ******************************************************/
 function deleteChannelFromDB(channel){
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
	"commands": commands,
	"deleteChannelFromDB": deleteChannelFromDB
}