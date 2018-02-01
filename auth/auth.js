var auth;
function authToken(){
	try{
		auth = require('./auth.json');
	}catch(e){
		auth = {
			"token": undefined,
			"yt_key": undefined
		}
	}
}

authToken();

module.exports = {
	"token": auth.token
}