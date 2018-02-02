/**
 * @file Permissions
 * @author Ian Leocádio
 * @version 1.0.0
 */

const Discord = require("discord.js");
/**
* Permission class definition
*
* @param {Object} permissions - Map<Command'names, permission> object contains the permissions of specific commands
*/
class Permissions{
	constructor(perms){
		//Map of command's permissions
		this.permissions = perms
	}

	/**
     * Checks the permission of a role on an command.
     *
     * @param {Function} func - Command function
     * @param {Collection<Snowflake, Role>} roles - [Doc]{@link https://discord.js.org/#/docs/main/stable/class/GuildMember?scrollTo=roles}
     *
     * @returns {Boolean} The current permission check
     */
	isPermitted(func, roles){
		if(this.permissions.get(func.name).roles.size == 0)
			return true;

		var verify = false;
		this.permissions.get(func.name).roles.forEach(function(role, key){
			 if(roles.exists('id', role.id))
			 	verify = true;
		});
		return verify;
	}

	/**
     * Encapsulated function to check permission and proceed the command's function call
     *
     * @param {Message} message - [Doc]{@link https://discord.js.org/#/docs/main/stable/class/Message}
     * @param {Function} func - Command function
     * @param {Arguments} /**./ - List of arguments that will be passed to command's function
     *
     * @returns
     */
	call(message, func /**/){
		var variadic_args = Array.prototype.slice.call(arguments, 2);
		
		//Verify permissions
		if(!this.isPermitted(func, message.member.roles)){
			message.reply('Você não possui cargo suficiente');
			return;
		}

		//Execute after is a permitted command
		func.apply(null, variadic_args);
	}

	/**
     * Add a role to a specific command's function
     *
     * @param {String} funcName - Command function's name
     * @param {Role} role - [Doc]{@link https://discord.js.org/#/docs/main/stable/class/Role}
     *
     * @returns {String} - List of string role's names updated
     */
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

	/**
     * Add a list of commands to a role
     *
     * @param {Message} message - [Doc]{@link https://discord.js.org/#/docs/main/stable/class/Message}
     * @param {String} roleName - Role's name
     * @param {Array} commands - List of commands passed in message.content
     *
     * @returns {String} - List of string command's names updated
     */
	addCommands(message, roleName, commands){
		var role = message.guild.roles.find(function(role){
			return role.name.toLowerCase() === roleName;
		});
		if (!role){
			message.reply("O cargo: "+roleName+" não existe");
			return;
		}

		var cmdDesc = "";

		var thisPerm = this
		if(commands[0] === "all"){
			this.permissions.forEach(function(cmd, key){
				cmd.roles.set(role.name+"#"+role.id, role);
				cmdDesc += key+"\n";
			});

			return cmdDesc;
		}
		commands.map(function(cmd){
			thisPerm.permissions.get(cmd).roles.set(role.name+"#"+role.id, role);
			cmdDesc += key+"\n";
		});

		return cmdDesc;
	}


	/**
     * Permission command controller
     *
     * @param {Message} message - [Doc]{@link https://discord.js.org/#/docs/main/stable/class/Message}
     *
     * @returns
     */
	commands(message){
		var commandArguments = message.content.toLowerCase().match(/\S+/g);
		var command = commandArguments[3];
		//Command name, function name
		var name = commandArguments[2];

		if(!command){
			return;
		}else

		if(command === "addRole" || command === "ar"){
			addRoles(this, message, commandArguments, name);
		}else

		if(command === "addCommands" || command === "ac"){
			addCommands(this, message, commandArguments, name);
		}
	}

	
}
/******************************************************
 *													  *
 *													  *
 *				Auxiliary's functions				  *
 *													  *
 *													  *
 ******************************************************/

function permInfo(){
	return new Discord.RichEmbed()
		.setColor("RED")
		.setAuthor("Configuração de permissões alterada:")
}

/******************************************************
 *													  *
 *													  *
 *				Command's functions					  *
 *													  *
 *													  *
 ******************************************************/
function addRoles(permObject, message, commandArguments, functionName){
	if(!commandArguments[2]){
		message.reply("");
		return;
	}

	var auxCommandArguments = Array.prototype.slice.call(commandArguments, 4);
	if(auxCommandArguments.length == 0){
		message.reply("É preciso informar os cargos permitidos para este comando.\nEx: *.music perm play addRole <Cargo1> <Cargo2>*");
		return; 
	}
	

	var thisPerm = permObject;
	var cargosDesc = "";
	auxCommandArguments.map(function(arg){
		var role = message.guild.roles.find(function(r){
			return r.name.toLowerCase() === arg;
		});
		if(typeof(role) === "object"){
			cargosDesc = thisPerm.addRole(functionName, role);
		}else{
			message.reply("Cargo inexistente");
			return;
		}
	});
	if(cargosDesc && cargosDesc !== ""){
		var embed = permInfo()
				.addField("Comando:", functionName, true)
				.addField("Modificado por", message.author.toString(), true)
				.addField("Cargos que podem usar:", cargosDesc);

		message.channel.send(embed);
	}
}

function addCommands(permObject, message, commandArguments, roleName){
	var auxCommandArguments = Array.prototype.slice.call(commandArguments, 4);
	if(auxCommandArguments.length == 0){
		message.reply("É preciso informar os comandos.\nEx: *.music perm Admin addCommands <cmd1> <cmd2>*");
		return; 
	}

	var cmdDesc = permObject.addCommands(message, roleName, auxCommandArguments);
	var role = message.guild.roles.find(function(r){
			return r.name.toLowerCase() === roleName;
		});
	if(cmdDesc && cmdDesc !== ""){
		var embed = permInfo()
				.addField("Cargo:", role.toString()+"", true)
				.addField("Modificado por", message.author.toString(), true)
				.addField("Comandos que podem usar:", cmdDesc);

		message.channel.send(embed);
	}
}


/******************************************************
 *													  *
 *													  *
 *						Exports 					  *
 *													  *
 *													  *
 ******************************************************/
module.exports = Permissions;