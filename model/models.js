const db = require("./db/db.js");

class Model{
	constructor(){
		this.connection = db.connection;
	}


	insert(table, props, values){
		const con = this.connection;
		con.serialize(function(){
			console.log(values, values.toString());
			var s = ""
			values.map(function(v, i){
				console.log(i);
				(values.length-1 != i) ? s+= "?," : s+="?";
			});
			console.log(s);

			con.run("INSERT INTO "+table+"("+props+") VALUES ("+s+")", values);
		});
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
}
module.exports = Model;



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