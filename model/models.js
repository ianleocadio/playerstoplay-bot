const db = require("./db/db.js");
const auth = require("../auth/auth.js");


const STAFF = auth.STAFF,
	MEMBERS = auth.MEMBERS;

/******************************************************
 *													  *
 *													  *
 *				Auxiliary's functions				  *
 *													  *
 *													  *
 ******************************************************/
function formatProps(props, values) {
	props = props.match(/\S+/g);
	props = props.map((p, i) => {
		p = p.replace(",", "");
		return p += "=" + values[i];
	});
	return props.toString().replace(/,/g, " and ");
}

/******************************************************
 *													  *
 *													  *
 *					 Classes						  *
 *													  *
 *													  *
 ******************************************************/

class Model {
	constructor(table) {
		this.connection = db.connection;
		this.table = table;
	}


	insert(props, values, cb) {
		const con = this.connection;
		const table = this.table;
		try {
			con.serialize(() => {
				let s = "";
				values.map((v, i) => {
					(values.length - 1 !== i) ? s += "?," : s += "?";
				});
				con.run("INSERT INTO " + table + "(" + props + ") VALUES (" + s + ")", values);
			});
		} catch (e) {
			if (cb){
				cb(e);
			}
			return;
		}
	}

	// update(table, props, values){
	// 	this.db.serialize(function(){
	// 		let stmt = db.prepare("UPDATE "+table+"("+props+") VALUES (?)");
	// 		values.map(function(v){
	// 			stmt.run(v);
	// 		});
	// 		stmt.finalize();
	// 	});
	// }

	delete(props, values, cb) {
		const con = this.connection;
		const table = this.table;
		try {
			props = formatProps(props, values);


			con.serialize(() => {
				con.run("DELETE FROM " + table + " WHERE " + props);
			});

		} catch (e) {
			if (cb){
				cb(e);
			}
			return;
		}

	}


	findOne(props, values, cb) {
		const con = this.connection;
		const table = this.table;

		try {
			props = formatProps(props, values);

			con.serialize(() => {
				con.get("SELECT * FROM " + table + " WHERE " + props, (error, row) => {
					cb(row, null);
				});
			});

		} catch (e) {
			//console.log(e);
			cb(null, e);
			return;
		}
	}
}

class Channel extends Model {
	constructor() {
		super("CHANNELS");
	}

	userChannels(userId, cb) {
		let con = this.connection;
		let table = this.table;
		let channels = [];
		con.serialize(() => {
			con.each("SELECT * FROM " + table + " WHERE USER_ID=?", userId, (error, row) => {
				if (error){ 
					return;
				}

				channels.push(row);
			}, function (error, length) {
				if (error) {
					cb(null, error);
					return;
				}
				cb(channels);
			});

		});
	}

	canCreate(message, cb) {
		let highestRole = message.member.highestRole;

		if (STAFF.has(highestRole.id)) {
			cb(true);
			return;
		}

		if (!MEMBERS.has(highestRole.id)) {
			cb(false, "Você não possui o cargo Players! Peça para alguém que tenha ou a algum Mod");
			return;
		}

		this.userChannels(message.author.id, (channels) => {
			if (channels.length >= 1){
				cb(false, "Você já atingiu o limite máximo de canais personalizados");
			}else{
				cb(true);
			}
		});
	}

	canRemove(message, channelId, cb) {
		let highestRole = message.member.highestRole;

		if (STAFF.has(highestRole.id)) {
			cb(true);
			return;
		}

		if (!MEMBERS.has(highestRole.id)) {
			cb(false, "Você não possui o cargo Players! Peça para alguém que tenha ou a algum Mod");
			return;
		}

		this.findOne("USER_ID, CHANNEL_ID", [message.author.id, channelId], (channel, error) => {
			if (error){ 
				cb(false, error);
			}

			if (channel){
				cb(true);
			}else{
				cb(false, "Este canal pertece a outro membro");
			}
		});

	}
}


/******************************************************
 *													  *
 *													  *
 *					exports 	 					  *
 *													  *
 *													  *
 ******************************************************/

module.exports = {Channel};



// db.serialize(function() {
//   db.run("CREATE TABLE lorem (info TEXT)");

//   let stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//   for (let i = 0; i < 10; i++) {
//       stmt.run("Ipsum " + i);
//   }
//   stmt.finalize();

//   db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//       console.log(row.id + ": " + row.info);
//   });
// });

// db.close();