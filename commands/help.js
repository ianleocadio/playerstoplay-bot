function listHelp(message){
	message.author.send(helpText);
}

var helpText =
  "```Markdown\n"
+ "# Lista de comandos:\n\n"
+ "[1]: Adicionar membro ao cargo Player\n"
+ "	   /add '@menções' (Ex: /add @Fulano @Pipitchu)\n\n"
// + "[2]:"
+ "```";




function possibleCommand(message){
	var cantExecuteHelpCommand = false;
	message.channel.fetchMessages({limit : 5, before: message.id})
		.then(messages => {
			const alreadyCommands = ["/gamerescape", "/xivdb", "/giphy", "/tenor", "/tts", "/me", "/tableflip", "/unflip", "/shrug"];
			var noneOfThen = true;
			alreadyCommands.map(function(command){
				if(message.content.startsWith(command))
					noneOfThen = false;
			});
			messages.map(function(bm){
				if(bm.content.startsWith("/") && noneOfThen && (Date.now() - bm.createdTimestamp < 300000))
					cantExecuteHelpCommand = true;
			});

			if (cantExecuteHelpCommand){
				message.delete();
				return;
			}
			

			
			if (noneOfThen)
				message.reply("Possível tentativa de usar um comando avistado! Utilize '/help' para listar os comandos atuais  :upside_down:");
		});
	
}


module.exports = {
	"listHelp": listHelp,
	"possibleCommand": possibleCommand
}