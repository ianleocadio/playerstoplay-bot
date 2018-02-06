var sqlite3 = require('sqlite3').verbose();
var con = new sqlite3.Database('db.sqlite3');

function initialize(){
	con.serialize(function(){

		var stmt = 
		  "CREATE TABLE IF NOT EXISTS CHANNELS("
		+ " ID TEXT PRIMARY KEY,"
		+ " USER_ID TEXT NOT NULL,"
		+ " CHANNEL_ID TEXT NOT NULL,"
		+ " CREATED_AT TEXT NOT NULL);";

		con.run(stmt, function(error){
			if(error) throw error;

			console.log("Script de banco executado");
		});
	});
}

module.exports = {
	"connection": con,
	"initialize": initialize
};

