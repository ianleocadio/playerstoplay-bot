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

module.exports = {
	"createListOfPermissions": createListOfPermissions
}