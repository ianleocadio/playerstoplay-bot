const Discord = require("discord.js");

class Permissions{
	constructor(perms){
		//Map of command's permissions
		this.permissions = perms
	}

	isPermitted(func, roles){
		var verify = false;
		this.permissions.get(func.name).roles.forEach(function(role, key){
			 if(roles.exists('id', role.id))
			 	verify = true;
		});
		return verify;
	}


	call(message, func /**/){
		var variadic_args = Array.prototype.slice.call(arguments, 2);
		
		//Verify permissions
		if(!this.isPermitted(func, message.member.roles)){
			return;
		}

		//Execute after is a permitted command
		func.apply(null, variadic_args);
	}

	//Modify command's permission
	addRole(funcName, role){
		if(this.permissions.get(funcName).roles.has(role.name+"#"+role.id))
			return;
		
		this.permissions.get(funcName).roles.set(role.name+"#"+role.id, role);

		var cargosDesc = "";
		this.permissions.get(funcName).roles.forEach(function(role, key){
			cargosDesc += role.toString() + "\n";
		});	 

		return cargosDesc;
	}

	addCommands(message, roleName, commands){
		var role = message.guild.roles.find(function(role){
			return role.name.toLowerCase() === roleName;
		});
		if (!role){
			message.reply("O cargo: "+roleName+" não existe");
			return;
		}
		var thisPerm = this
		if(commands[0] === "all"){
			this.permissions.forEach(function(cmd, key){
				cmd.roles.set(role.name+"#"+role.id, role);
			});
			return;
		}
		commands.map(function(cmd){
			thisPerm.permissions.get(cmd).roles.set(role.name+"#"+role.id, role);
		});
	}


	//Commands
	commands(message){
		var commandArguments = message.content.toLowerCase().match(/\S+/g);
		var command = commandArguments[3];
		//Command name, function name
		var name = commandArguments[2];

		if(!command){
			return;
		}else

		if(command === "addRole" || command === "ar"){
			if(!commandArguments[2]){
				message.reply("");
				return;
			}

			var auxCommandArguments = Array.prototype.slice.call(commandArguments, 4);
			if(auxCommandArguments.length == 0){
				message.reply("É preciso informar os cargos permitidos para este comando.\nEx: *.music perm play addRole <Cargo1> <Cargo2>*");
				return; 
			}
			

			var thisPerm = this;
			var cargosDesc = "";
			auxCommandArguments.map(function(arg){
				var role = message.guild.roles.find(function(r){
					return r.name.toLowerCase() === arg;
				});
				if(typeof(role) === "object"){
					cargosDesc = thisPerm.addRole(name, role);
				}else{
					message.reply("Cargo inexistente");
					return;
				}
			});
			if(cargosDesc && cargosDesc !== ""){
				var embed = permInfo()
						.addField("Comando:", name, true)
						.addField("Modificado por", message.author.username+"#"+message.author.discriminator, true)
						.addField("Cargos que podem usar:", cargosDesc);

				message.channel.send(embed);
			}
		}else

		if(command === "addCommands" || command === "ac"){
			var auxCommandArguments = Array.prototype.slice.call(commandArguments, 4);
			if(auxCommandArguments.length == 0){
				message.reply("É preciso informar os comandos.\nEx: *.music perm Admin addCommands <cmd1> <cmd2>*");
				return; 
			}

			this.addCommands(message, name, auxCommandArguments);
		}
	}

	
}


function permInfo(){
	return new Discord.RichEmbed()
		.setColor("RED")
		.setAuthor("Configuração de permissões alterada:")
}

module.exports = Permissions;