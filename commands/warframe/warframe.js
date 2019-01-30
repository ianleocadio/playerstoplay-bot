const Discord = require("discord.js");
const Utils = require("../../util/utils.js");
const auth = require('../../auth/auth.js');
const rp = require('request-promise');
const WorldState = require("./models/WorldState");
const Embeds = require("./embeds/embeds.js");
const Watcher = require("./watcher/Watcher");





function commands(message) {
	var commandArguments = message.content.match(/\S+/g);
	console.log(commandArguments);

	try {
		var command = commandArguments[1].toLowerCase();
	} catch (e) {
		return;
	}

	if (!command) {
		return;
	} else

		if (command === "b" || command === "build") {
			WarframePermissions.call(message, build, message, commandArguments);
		}

	if (command === "a" || command === "alerts") {
		WarframePermissions.call(message, alerts, message, commandArguments);
	}

	if (command === "cwa" || command === "createWatcherAlert") {
		WarframePermissions.call(message, createWatcherAlert, message, commandArguments);
	}

	if (command === "pwa" || command === "pauseWatcherAlert") {
		WarframePermissions.call(message, stopWatcherAlert, message, commandArguments);
	}

	if (command === "lwa" || command === "listWatcherAlert") {
		WarframePermissions.call(message, listWatcherAlert, message, commandArguments);
	}

	if (command === "swa" || command === "statusWatcherAlert") {
		WarframePermissions.call(message, statusWatcherAlert, message, commandArguments);
	}


}




/******************************************************
 *													  *
 *													  *
 *				Auxiliary's functions				  *
 *													  *
 *													  *
 ******************************************************/
function snippetTreatment(snippet, query) {
	snippet = snippet.split('\n').join('');
	return snippet.split('.').find(function (s) {
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

function build(message, commands) {
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
	}, function (error, response) {
		if (response.items) {
			var item = snippetTreatment(response.items[0].snippet, query).trim();
			var link = response.items[0].link;
			link += "/Builder/" + item.split(' ').join('_');
			message.channel.send(link);
		}
	});
}

function alerts(message, commands) {

	rp('http://content.warframe.com/dynamic/worldState.php')
		.then(function (response) {
			let ws = new WorldState(response);

			let alertEmbed = new Embeds.AlertEmbed(ws.alerts, "PC");
			console.log(ws.alerts);
			message.channel.send(alertEmbed.showAlerts());
		})
		.catch(function (err) {
			console.log(err);
		});


}

function createWatcherAlert(message, commands) {
	
	const channel = message.client.channels.find(c=>c.name == 'alerts' && c.type == 'text');

	if (!channel) {
		return;
	}
	let query = Array.prototype.slice.call(commands, 2).toString();
	query = query.replace(/,/g, " ");
	query = query.replace(/(\<@.*?\>)/gi, "");
	let w = new Watcher(channel)
	w.push(query, message.author, new Date());
}

function pauseWatcherAlert(message, commands) {
	let query = Array.prototype.slice.call(commands, 2).toString();
	query = query.replace(/,/g, " ");
	query = query.replace(/(\<@.*?\>)/gi, "");
	let w = new Watcher();
	w.stop(query);
}


function listWatcherAlert(message, commands) {
	let w = new Watcher();
	w.listCurrentAlerts();
	
}

function statusWatcherAlert(message, commands){
	let query = Array.prototype.slice.call(commands, 2).toString();
	query = query.replace(/,/g, " ");
	query = query.replace(/(\<@.*?\>)/gi, "");
	let w = new Watcher();
	let item = w.get(commands[2]);
	if (item == null) return;
	message.channel.send((new Embeds.StatusAlertWatcherEmbed(item)).show());
	
}


/******************************************************
 *													  *
 *													  *
 *						Permissions					  *
 *													  *
 *													  *
 ******************************************************/
const Permissions = require("../../config/permissions.js");
var functions = [
	build,
	alerts,
	createWatcherAlert,
	pauseWatcherAlert,
	listWatcherAlert,
	statusWatcherAlert
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