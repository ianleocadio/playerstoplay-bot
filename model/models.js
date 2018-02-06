const db = require("./db/db.js");

class Model{
	constructor(table){
		this.connection = db.connection;
		this.table = table;
	}


	insert(props, values, cb){
		const con = this.connection;
		const table = this.table;
		try{
			con.serialize(function(){
				var s = ""
				values.map(function(v, i){
					(values.length-1 != i) ? s+= "?," : s+="?";
				});
				con.run("INSERT INTO "+table+"("+props+") VALUES ("+s+")", values);
			});
		}catch(e){
			console.log(e);
			cb(e);
			return;
		}
	}

	// update(table, props, values){
	// 	this.db.serialize(function(){
	// 		var stmt = db.prepare("UPDATE "+table+"("+props+") VALUES (?)");
	// 		values.map(function(v){
	// 			stmt.run(v);
	// 		});
	// 		stmt.finalize();
	// 	});
	// }

	delete(props, values, cb){
		const con = this.connection;
		const table = this.table;
		try{
			props = formatProps(props, values);


			con.serialize(function(){
				con.run("DELETE FROM "+table+" WHERE "+props);
			});

		}catch(e){
			console.log(e);
			cb(e);
			return;
		}
		
	}


	findOne(props, values, cb){
		const con = this.connection;
		const table = this.table;

		try{
			props = formatProps(props, values);

			con.serialize(function(){
				con.get("SELECT * FROM "+table+" WHERE "+props, function(error, row){
					cb(row, undefined);
				});
			});

		}catch(e){
			console.log(e);
			cb(undefined, error);
			return;
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
function formatProps(props, values){
	props = props.match(/\S+/g);;
	props = props.map((p, i) => {
		p = p.replace(",", ""); 
		return p+="="+values[i];
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
class Channel extends Model{
	constructor(){
		super("CHANNELS");
	}

	userChannels(userId, cb){
		var con = this.connection;
		var table = this.table;
		var channels = [];
		con.serialize(function(){
			con.each("SELECT * FROM "+table+" WHERE USER_ID=?", userId, function(error, row){
				if(error){
					cb(undefined, error);
					return;
				}

				channels.push(row);
			});
			cb(channels, undefined);
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

module.exports = {
	"Channel": Channel
};



// db.serialize(function() {
//   db.run("CREATE TABLE lorem (info TEXT)");
 
//   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//   for (var i = 0; i < 10; i++) {
//       stmt.run("Ipsum " + i);
//   }
//   stmt.finalize();
 
//   db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//       console.log(row.id + ": " + row.info);
//   });
// });
 
// db.close();