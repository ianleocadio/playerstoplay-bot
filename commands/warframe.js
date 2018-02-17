const Discord = require("discord.js");
const Utils = require("../util/utils.js");
const auth = require('../auth/auth.js');


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

	if(command === "b" || command === "build"){
		WarframePermissions.call(message, build, message, commandArguments);
	}

}




/******************************************************
 *													  *
 *													  *
 *				Auxiliary's functions				  *
 *													  *
 *													  *
 ******************************************************/
function snippetTreatment(snippet, query){
	snippet = snippet.split('\n').join('');
	return snippet.split('.').find(function(s){
				var sLow = s.toLowerCase();
				return sLow.includes(query);
			});
}

/******************************************************
 *													  *
 *													  *
 *				Command's functions					  *
 *													  *
 *													  *
 ******************************************************/

function build(message, commands){
	var GoogleSearch = require('google-search');
	var googleSearch = new GoogleSearch({
	  key: auth.yt_key,
	  cx: "015410166601801766056:e_vka8pzzb4"
	});


	let query = Array.prototype.slice.call(commands, 2).toString();
	query = query.replace(/,/g, " "); 
	query = query.replace(/(\<@.*?\>)/gi, ""); 
	
	googleSearch.build({
	  q: query,
	  num: 10, // Number of search results to return between 1 and 10, inclusive 
	}, function(error, response) {
	  if(response.items){
	  	var item = snippetTreatment(response.items[0].snippet, query).trim();
	  	var link = response.items[0].link;
	  	link += "/Builder/" + item.split(' ').join('_');
	  	message.channel.send(link);
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
	build
];
var WarframePermissions = new Permissions(Utils.createListOfPermissions(functions));


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