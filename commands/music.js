const YTDL = require("ytdl-core");
//Global music queue
var server = {
	"queue": []
};


function musicCommands(message){
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

		server.queue.push(musicCommand[2]);

		if(!message.guild.voiceConnnection){
			message.member.voiceChannel.join()
				.then(function(connection){
					play(connection, message);
				});
		}
	}else 
	

	if(musicCommand[1].toLowerCase() === "skip"){
		if (server.dispatcher) server.dispatcher.end();
	}else
	


	if(musicCommand[1].toLowerCase() === "stop"){
		if(message.guild.voiceConnection){
			message.guild.voiceConnection.disconnect();
		}
	} 
}

//Auxiliary functions
function play(connection, message){
	server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

	server.queue.shift();
	server.dispatcher.on("end", function(){
		if(server.queue[0]) play(connection, message);
		else connection.disconnect();
	});
} 


module.exports = {
	"musicCommands": musicCommands
}