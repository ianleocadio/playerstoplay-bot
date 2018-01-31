var auth;
function authToken(){
	try{
		auth = require('./auth.json');
	}catch(e){
		auth = {
			"token": undefined
		}
		console.log(e);
	}
}

authToken();

module.exports = {
	"token": auth.token
}