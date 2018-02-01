const Discord = require("discord.js")
const YTDL = require("ytdl-core");
//Global music queue
var server = {
	"queue": []
};


function musicCommands(message, bot){
	var musicCommand = message.content.split(" ");
	if(!musicCommand[1]){
		// message.author.sendMessage("Comandos de musica");
		return
	}


	if(musicCommand[1].toLowerCase() === "play"){
		if(!message.member.voiceChannel){
			message.channel.sendMessage("Você precisa estar em um canal de voz para utilizar este comando!");
			return;
		}else if(!musicCommand[2])
			message.reply("É preciso informar o link da música :wink:");
		//1

		YTDL.getInfo(musicCommand[2])
			.then(function(info){

				server.queue.push(info);

				if(!message.guild.voiceConnection){
					message.member.voiceChannel.join()
						.then(function(connection){
							play(connection, message);
						});
				}
			},
			function(error){
				if (error) throw error;
			}
		);
		
	}else 
	

	if(musicCommand[1].toLowerCase() === "skip"){
		if (server.dispatcher) server.dispatcher.end();
	}else
	


	if(musicCommand[1].toLowerCase() === "stop"){
		if(message.guild.voiceConnection){
			message.guild.voiceConnection.disconnect();
		}
	}

	if(musicCommand[1].toLowerCase() === "playlist"){

		var embed = new Discord.RichEmbed()
			.setColor("GREEN");
		if(server.queue.length >  0){
			server.queue.map(function(musicInfo, i){
				var formatedVideoTime = Math.floor(musicInfo.length_seconds/60) + ":" + (musicInfo.length_seconds%60);

				if(i == 0){
					embed.setDescription("**Now playing:**\n"+musicInfo.title+"\n"+ musicInfo.video_url+" - ("+formatedVideoTime+")")
					 	 .setThumbnail(musicInfo.thumbnail_url)
					 	 .setURL(musicInfo.video_url)
					 	 .setAuthor("Playlist: ");
				}else{
					embed.addBlankField()
					 	 .addField((i)+" - "+musicInfo.title+"", musicInfo.video_url+" - ("+formatedVideoTime+")");
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
				 .setDescription("**No music is playing**");
		}
		embed.setTimestamp();
		message.channel.send(embed);
	}

	if(musicCommand[1].toLowerCase() === "playing"){
		var embed = new Discord.RichEmbed()
			.setColor("GREEN");
		if(server.queue.length >  0){
			var musicInfo = server.queue[0];
			var formatedVideoTime = Math.floor(musicInfo.length_seconds/60) + ":" + (musicInfo.length_seconds%60);

			embed.setDescription("**Now playing:**\n"+musicInfo.title+"\n"+ musicInfo.video_url+" - ("+formatedVideoTime+")")
			 	 .setThumbnail(musicInfo.thumbnail_url)
			 	 .setURL(musicInfo.video_url);
				
		}else{
			embed.setDescription("**No music is playing**");
		}
		embed.setTimestamp();
		message.channel.send(embed);
	} 
}

//Auxiliary functions
function play(connection, message){
	server.dispatcher = connection.playStream(YTDL.downloadFromInfo(server.queue[0], {filter: "audioonly"}));

	server.dispatcher.on("end", function(){
		server.queue.shift();
		if(server.queue[0]) play(connection, message);
		else connection.disconnect();
	});
}

function playlist(){

} 


module.exports = {
	"musicCommands": musicCommands
}