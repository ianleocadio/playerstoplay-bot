var auth;
function authToken(){
	try{
		auth = require('./auth.json');

		let map = new Map();
		auth.STAFF.map(function(s){
		    map.set(s.id, s.name);
        });
		auth.STAFF = map;

		map = new Map();
		auth.MEMBERS.map(function(m){
		    map.set(m.id, m.name);
        });
		auth.MEMBERS = map;
	}catch(e){
		auth = {
			"token": process.env.BOT_TOKEN,
			"yt_key": process.env.YT_KEY,

			"STAFF": (process.env.STAFF || []),
            "MEMBERS": (process.env.MEMBERS || [])
		}
	}
}

authToken();

module.exports = auth