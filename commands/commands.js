const CommandMap = require("./CommandMap");

let commandsList = new CommandMap();
commandsList.set(/^(?:h|help)$/g, 		require("./help.js").commands);
commandsList.set(/^(?:add)$/g, 			require("./roles.js").addPlayerRole);
commandsList.set(/^(?:m|music)$/g, 		require("./music.js").commands);
commandsList.set(/^(?:c|config)$/g,     require("../config/config.js").commands);
commandsList.set(/^(?:ch|channel)$/g,   require("./channel.js").commands);
commandsList.set(/^(?:wrf|warframe)$/g, require("./warframe/warframe.js").commands);



function commandTreatment(message, permFunction, cb){
	if (!message) {
		return null;
	}

	var commandArguments = message.content.match(/\S+/g);
	var command = null;
	try {
		command = commandArguments[1].toLowerCase();
	} catch (e) {
		if (cb){
			cb(e);
		}
		return null;
	}

	if (command === "perm"){
		if (permFunction){
			permFunction(message);
		}
		return null;
	}

	
	return {
		command, 
		commandArguments
	};
}


module.exports = { 
	commandsList,
	commandTreatment
};