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
function httpGet(theUrl, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function uuid(){
	const uuidv4 = require('uuid/v4');
	return uuidv4();
}


module.exports = {
	"createListOfPermissions": createListOfPermissions,
	"httpGet": httpGet,
	"uuid": uuid
}