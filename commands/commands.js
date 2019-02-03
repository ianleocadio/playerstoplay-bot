const CommandMap = require("./CommandMap");

let commandsList = new CommandMap();
commandsList.set(/^(?:h|help)$/g, 		require("./help.js").commands);
commandsList.set(/^(?:add)$/g, 			require("./roles.js").commands);
commandsList.set(/^(?:m|music)$/g, 		require("./music.js").commands);
commandsList.set(/^(?:c|config)$/g,     require("../config/config.js").commands);
commandsList.set(/^(?:ch|channel)$/g,   require("./channel.js").commands);
commandsList.set(/^(?:wrf|warframe)$/g, require("./warframe/warframe.js").commands);



function commandTreatment(){

};






module.exports = { 
	commandsList
};