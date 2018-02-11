const Discord = require("discord.js");
const auth = require('../auth/auth.js');
const Utils = require("../util/utils.js");

const ytSearch = require('youtube-search');
const YTDL = require("ytdl-core");
const ytPlaylist = require('youtube-playlist-info');
//Global music queue
var server = {
	"queue": []
};


function commands(message, bot){
	var commandArguments = message.content.match(/\S+/g);
	try{
		var command = commandArguments[1].toLowerCase();
	}catch(e){
		return;
	}

	if(!command){
		musicHelp(message);
	}else

	if(command === "play" || command === "p"){

		if(commandArguments[2]){
			MusicPermissions.call(message, play, message, commandArguments);
		}else{
			if (server.dispatcher){
				if(server.dispatcher.paused)
					MusicPermissions.call(message, resume);
				else
					MusicPermissions.call(message, pause);
			}
		}

	}else 
	
	if(command === "skip"){
		MusicPermissions.call(message, end);
	}else
	
	if(command === "stop"){
		MusicPermissions.call(message, stop, message);
	}else

	if(command === "pause"){
		MusicPermissions.call(message, pause);
	}else

	if(command === "resume" || command === "r"){
		MusicPermissions.call(message, resume);
	}else

	if(command === "playlist" || command === "pl" || command === "queue" || command === "q"){
		MusicPermissions.call(message, playlist, message);
	}else

	if(command === "playing" || command === "now"){
		MusicPermissions.call(message, playing, message);
	}else

	if(command === "help" || command === "h"){
		MusicPermissions.call(message, musicHelp, message);
	}else

	if(command === "perm"){
		MusicPermissions.commands(message);
	}
}




/******************************************************
 *													  *
 *													  *
 *				Auxiliary's functions				  *
 *													  *
 *													  *
 ******************************************************/

function formateTime(timeString){
	var hourString,minString, secString;

	if(timeString >= 3600){
		var hour = Math.floor(timeString/3600);
		if(hour < 10)
			hourString = "0"+hour+":";
		timeString = timeString%3600;
	}

	var min = Math.floor(timeString/60);
	if(min < 10)
		minString = "0"+min+":";

	var sec = Math.floor(timeString%60);
	if (sec < 10)
		secString = "0"+sec;

	return (hourString || hour || "00:") + (minString || min) + (secString || sec);
}

function playMusic(connection, message){
	server.dispatcher = connection.playStream(YTDL.downloadFromInfo(server.queue[0].info, {filter: "audioonly", quality: "highestaudio"}));

	server.dispatcher.on("end", function(){
		server.queue.shift();
		if(server.queue[0]) playMusic(connection, message);
		else connection.disconnect();
	});
}

function sendPlayInfo(message, queueObject, queuePosition, title){
	var embed = new Discord.RichEmbed()
			.setColor("GREEN");
	var musicInfo = queueObject.info;
	var formatedVideoTime = formateTime(musicInfo.length_seconds);

	embed.setDescription("**"+musicInfo.title+"**")
		 .setAuthor(title)
		 .addField("Duração", formatedVideoTime, true)
		 .addField("Pedido por", queueObject.requested_by.toString(), true)
		 .addField("Posição na fila", (queuePosition == 1) ? "Tocando" : queuePosition, true)
	 	 .setThumbnail(musicInfo.thumbnail_url)
	 	 .setURL(musicInfo.video_url);
			
	message.channel.send(embed);
}

function getPlayInfo(message, searchParam, showInfo){

	if(!message.member.voiceChannel){
		message.channel.sendMessage("Você precisa estar em um canal de voz para utilizar este comando!");
		return;
	}else if(!searchParam)
		message.reply("É preciso informar o link ou nome da música :wink:");
	//1

	var opts = {
			maxResults: 10,
			key: (auth.yt_key || process.env.YT_KEY)
		}

	YTDL.getInfo(searchParam, (err, info) => {
		if (err) return console.log(err);

		let queueObject = {
			"info": info,
			"requested_by": message.author
		};
		queuePosition = server.queue.push(queueObject);
		if(showInfo || typeof(showInfo) === "undefined")
			sendPlayInfo(message, queueObject, queuePosition, "Música adicionada!");
		
		if(!message.guild.voiceConnection){
			message.member.voiceChannel.join()
				.then(function(connection){
					playMusic(connection, message);
				});
		}
	});
}

function getPlaylist(message, playListId){
	const options = {
	  maxResults: 20
	};
	ytPlaylist((auth.yt_key || process.env.YT_KEY), playListId, options)
		.then(items => {
		  items.map(function(item, i){
		  	getPlayInfo(message, item.resourceId.videoId, false);
		  });
		}).catch(console.error);
}

/******************************************************
 *													  *
 *													  *
 *				Command's functions					  *
 *													  *
 *													  *
 ******************************************************/
function play(message, searchParams){
	if(YTDL.validateURL(searchParams[2])){
		var url = searchParams[2];
		
		if(url.includes("list=")){
	    	url = url.split("list=")[1];
	        if(url.includes("&t="))
	        	url = url.split("&t=")[0];

	        getPlaylist(message, url);
	     }else{
	     	getPlayInfo(message, url);
	     }


	}else{
		var opts = {
			maxResults: 10,
			key: (auth.yt_key || process.env.YT_KEY)
		}
		var query = "";

		searchParams = Array.prototype.slice.call(searchParams, 2);
		searchParams.map(function(t){
			query += t + " ";
		});
		ytSearch(query, opts, function(error, results){
			if(error) return console.log(error);


			getPlayInfo(message, results[0].link);
		});
	}
}

function playlist(message){
	var embed = new Discord.RichEmbed()
			.setColor("GREEN");
	if(server.queue.length >  0){
		server.queue.map(function(object, i){
			var musicInfo = object.info;
			var formatedVideoTime = formateTime(musicInfo.length_seconds);

			if(i == 0){
				embed.setDescription("**Now playing:**")
				 	 .addField(musicInfo.title, "("+formatedVideoTime+")", true)
				 	 .addField("Pedido por", object.requested_by.toString(), true)
				 	 .addBlankField()
				 	 .setThumbnail(musicInfo.thumbnail_url)
				 	 .setURL(musicInfo.video_url)
				 	 .setAuthor("Playlist: ");
			}else{
				embed
					// .addBlankField()
				 	 .addField((i+1)+" - "+musicInfo.title, "("+formatedVideoTime+")")
				 	 // .addBlankField(true)
				 	 // .addField("Pedido por", object.requested_by.username+"#"+object.requested_by.discriminator, true)
			}
			/*
				title
				video_url
				length_seconds
				timestamp
				thumbnail_url
			*/
		});
	}else{
		embed.setAuthor("Playlist: ")
			 .setDescription("**Nenhuma música na playlist**");
	}
	message.channel.send(embed);
}

function stop(message){
	if(message.guild.voiceConnection){
		message.guild.voiceConnection.disconnect();
	}
}

function playing(message){
	if(server.queue.length >  0){
		var musicInfo = server.queue[0];
		sendPlayInfo(message, musicInfo, 1, "Tocando agora:");
	}else{
		var embed = new Discord.RichEmbed()
			.setColor("GREEN");
		embed.setDescription("**No music is playing**");
		embed.setTimestamp();
		message.channel.send(embed);
	}	
}

function musicHelp(message){
	var title = "Lista de comandos /music:"
	var embed = new Discord.RichEmbed()
						   .setTitle(title)
						   .setColor("GREEN");

	var helpText ="-------------------------------\n\n";
	helpText += "**1 - __Toca a música selecionada no canal de voz atual ou continua música atual__**\n";
	helpText += "*Ex:  /music play [Link do vídeo do youtube]*\n*Ex: /music play*\n\n";
	helpText += "**2 - __Lista a fila de músicas que serão tocadas em seguida__**\n";
	helpText += "*Ex:  /music playlist*\n\n";
	helpText += "**3 - __Pausa música atual__**\n";
	helpText += "*Ex:  /music pause*\n\n";
	helpText += "**4 - __Pula para próxima música da playlist__**\n";
	helpText += "*Ex:  /music skip*\n\n";
	helpText += "**5 - __Para música e desconecta bot__**\n";
	helpText += "*Ex:  /music stop*\n\n";
	helpText += "**6 - __Exibe informações da música atual__**\n";
	helpText += "*Ex:  /music playing*\n\n";

	embed.setDescription(helpText);
	// embed.setTimestamp();
	message.author.send(embed);
}

function pause(){
	if (server.dispatcher) server.dispatcher.pause();
} 

function resume(){
	if (server.dispatcher) server.dispatcher.resume();
} 

function end(){
	if (server.dispatcher) server.dispatcher.end();
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
	play,
	playlist,
	stop,
	playing,
	musicHelp,
	pause,
	resume,
	end
];
var MusicPermissions = new Permissions(Utils.createListOfPermissions(functions));


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