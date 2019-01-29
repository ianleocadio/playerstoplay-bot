function createListOfPermissions(functions){
	var map = new Map();
	functions.map(function(f){
		map.set(f.name, {
			"function": f,
			"roles": new Map()
		});
	});
	return map;
}


function uuid(){
	const uuidv4 = require('uuid/v4');
	return uuidv4();
}


module.exports = {
	"createListOfPermissions": createListOfPermissions,
	"uuid": uuid
}