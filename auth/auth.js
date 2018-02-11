var auth;
function authToken(c){
	try{
		auth = require('./auth.json');

		c(auth.STAFF, auth.MEMBERS);

	}catch(e){
		auth = {
			"token": process.env.BOT_TOKEN,
			"yt_key": process.env.YT_KEY,
			"STAFF": process.env.STAFF,
			"MEMBERS": process.env.MEMBERS
		}

		c(auth.STAFF, auth.MEMBERS);

	}
}

authToken(function(STAFF, MEMBERS){
	let map = new Map();
	STAFF.map(function(s){
	    map.set(s.id, s.name);
    });
	auth.STAFF = map;

	map = new Map();
	MEMBERS.map(function(m){
	    map.set(m.id, m.name);
    });
	auth.MEMBERS = map;
});

console.log(auth);

module.exports = auth